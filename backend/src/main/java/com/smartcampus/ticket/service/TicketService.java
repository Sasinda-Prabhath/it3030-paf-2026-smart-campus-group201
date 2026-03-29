package com.smartcampus.ticket.service;

import com.smartcampus.common.security.CurrentUserService;
import com.smartcampus.ticket.dto.AddTicketCommentDto;
import com.smartcampus.ticket.dto.CreateTicketDto;
import com.smartcampus.ticket.dto.TicketAttachmentDto;
import com.smartcampus.ticket.dto.TicketCommentDto;
import com.smartcampus.ticket.dto.TicketDetailDto;
import com.smartcampus.ticket.dto.TicketDto;
import com.smartcampus.ticket.entity.Ticket;
import com.smartcampus.ticket.entity.TicketAttachment;
import com.smartcampus.ticket.entity.TicketComment;
import com.smartcampus.ticket.entity.TicketStatus;
import com.smartcampus.ticket.repository.TicketAttachmentRepository;
import com.smartcampus.ticket.repository.TicketCommentRepository;
import com.smartcampus.ticket.repository.TicketRepository;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    private static final long MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private TicketAttachmentRepository ticketAttachmentRepository;

    @Autowired
    private TicketCommentRepository ticketCommentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CurrentUserService currentUserService;

    private final Path attachmentStoragePath;

    public TicketService(@Value("${app.ticket.attachments.storage-path:uploads/tickets}") String attachmentStoragePath) {
        this.attachmentStoragePath = Paths.get(attachmentStoragePath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.attachmentStoragePath);
        } catch (IOException exception) {
            throw new IllegalStateException("Could not initialize ticket attachment storage", exception);
        }
    }

    public TicketDto create(@NonNull CreateTicketDto dto) {
        User currentUser = getCurrentUser();

        Ticket ticket = new Ticket();
        ticket.setTitle(dto.getTitle().trim());
        ticket.setDescription(dto.getDescription().trim());
        ticket.setLocation(dto.getLocation().trim());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedByEmail(currentUser.getEmail());
        ticket.setCreatedByName(normalizeName(currentUser));
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        return mapTicket(ticketRepository.save(ticket));
    }

    public List<TicketDto> getMyTickets() {
        User currentUser = getCurrentUser();
        return ticketRepository.findByCreatedByEmailOrderByCreatedAtDesc(currentUser.getEmail())
            .stream()
            .map(this::mapTicket)
            .toList();
    }

    public TicketDetailDto getMyTicket(@NonNull Long ticketId) {
        User currentUser = getCurrentUser();
        Ticket ticket = getOwnedTicket(ticketId, currentUser);

        TicketDetailDto detail = new TicketDetailDto();
        copyTicket(detail, ticket);
        detail.setComments(ticketCommentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId)
            .stream()
            .map(this::mapComment)
            .toList());
        detail.setAttachments(ticketAttachmentRepository.findByTicketIdOrderByUploadedAtAsc(ticketId)
            .stream()
            .map(this::mapAttachment)
            .toList());

        return detail;
    }

    public TicketAttachmentDto uploadAttachment(@NonNull Long ticketId, @NonNull MultipartFile file) {
        User currentUser = getCurrentUser();
        Ticket ticket = getOwnedTicket(ticketId, currentUser);

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Attachment file is empty");
        }

        if (file.getSize() > MAX_ATTACHMENT_SIZE_BYTES) {
            throw new IllegalArgumentException("Attachment exceeds 10MB limit");
        }

        String originalFileName = file.getOriginalFilename() == null ? "attachment" : file.getOriginalFilename().trim();
        String fileExtension = extractExtension(originalFileName);
        String storedFileName = UUID.randomUUID() + fileExtension;
        Path targetPath = attachmentStoragePath.resolve(storedFileName);

        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to store attachment file", exception);
        }

        TicketAttachment attachment = new TicketAttachment();
        attachment.setTicketId(ticket.getId());
        attachment.setOriginalFileName(originalFileName);
        attachment.setStoredFileName(storedFileName);
        attachment.setContentType(resolveContentType(file));
        attachment.setFileSizeBytes(file.getSize());
        attachment.setUploadedByEmail(currentUser.getEmail());
        attachment.setUploadedByName(normalizeName(currentUser));
        attachment.setUploadedAt(LocalDateTime.now());

        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        return mapAttachment(ticketAttachmentRepository.save(attachment));
    }

    public AttachmentDownload downloadAttachment(@NonNull Long ticketId, @NonNull Long attachmentId) {
        User currentUser = getCurrentUser();
        getOwnedTicket(ticketId, currentUser);

        TicketAttachment attachment = ticketAttachmentRepository.findByIdAndTicketId(attachmentId, ticketId)
            .orElseThrow(() -> new IllegalArgumentException("Attachment not found"));

        Path filePath = attachmentStoragePath.resolve(attachment.getStoredFileName()).normalize();
        Resource resource = new FileSystemResource(filePath);

        if (!resource.exists() || !resource.isReadable()) {
            throw new IllegalArgumentException("Attachment file is missing");
        }

        return new AttachmentDownload(
            resource,
            attachment.getOriginalFileName(),
            attachment.getContentType()
        );
    }

    public TicketCommentDto addComment(@NonNull Long ticketId, @NonNull AddTicketCommentDto dto) {
        User currentUser = getCurrentUser();
        Ticket ticket = getOwnedTicket(ticketId, currentUser);

        TicketComment comment = new TicketComment();
        comment.setTicketId(ticket.getId());
        comment.setAuthorEmail(currentUser.getEmail());
        comment.setAuthorName(normalizeName(currentUser));
        comment.setComment(dto.getComment().trim());
        comment.setCreatedAt(LocalDateTime.now());

        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        return mapComment(ticketCommentRepository.save(comment));
    }

    private User getCurrentUser() {
        String email = currentUserService.getCurrentUserEmail();
        if (email == null || email.isBlank()) {
            throw new AccessDeniedException("No authenticated user found");
        }

        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Current user not found"));
    }

    private Ticket getOwnedTicket(Long ticketId, User currentUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));

        if (!ticket.getCreatedByEmail().equalsIgnoreCase(currentUser.getEmail())) {
            throw new AccessDeniedException("You can only access your own tickets");
        }

        return ticket;
    }

    private TicketDto mapTicket(Ticket ticket) {
        TicketDto dto = new TicketDto();
        copyTicket(dto, ticket);
        return dto;
    }

    private void copyTicket(TicketDto dto, Ticket ticket) {
        dto.setId(ticket.getId());
        dto.setTitle(ticket.getTitle());
        dto.setDescription(ticket.getDescription());
        dto.setLocation(ticket.getLocation());
        dto.setStatus(ticket.getStatus().name());
        dto.setCreatedByEmail(ticket.getCreatedByEmail());
        dto.setCreatedByName(ticket.getCreatedByName());
        dto.setCreatedAt(ticket.getCreatedAt() != null ? ticket.getCreatedAt().toString() : "");
        dto.setUpdatedAt(ticket.getUpdatedAt() != null ? ticket.getUpdatedAt().toString() : "");
    }

    private TicketCommentDto mapComment(TicketComment comment) {
        TicketCommentDto dto = new TicketCommentDto();
        dto.setId(comment.getId());
        dto.setTicketId(comment.getTicketId());
        dto.setAuthorEmail(comment.getAuthorEmail());
        dto.setAuthorName(comment.getAuthorName());
        dto.setComment(comment.getComment());
        dto.setCreatedAt(comment.getCreatedAt() != null ? comment.getCreatedAt().toString() : "");
        return dto;
    }

    private TicketAttachmentDto mapAttachment(TicketAttachment attachment) {
        TicketAttachmentDto dto = new TicketAttachmentDto();
        dto.setId(attachment.getId());
        dto.setTicketId(attachment.getTicketId());
        dto.setOriginalFileName(attachment.getOriginalFileName());
        dto.setContentType(attachment.getContentType());
        dto.setFileSizeBytes(attachment.getFileSizeBytes());
        dto.setUploadedByEmail(attachment.getUploadedByEmail());
        dto.setUploadedByName(attachment.getUploadedByName());
        dto.setUploadedAt(attachment.getUploadedAt() != null ? attachment.getUploadedAt().toString() : "");
        return dto;
    }

    private String resolveContentType(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType == null || contentType.isBlank()
            ? MediaType.APPLICATION_OCTET_STREAM_VALUE
            : contentType;
    }

    private String extractExtension(String fileName) {
        int extensionIndex = fileName.lastIndexOf('.');
        if (extensionIndex < 0 || extensionIndex == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(extensionIndex);
    }

    private String normalizeName(User currentUser) {
        return currentUser.getFullName() == null || currentUser.getFullName().isBlank()
            ? currentUser.getEmail()
            : currentUser.getFullName().trim();
    }

    public static class AttachmentDownload {
        private final Resource resource;
        private final String fileName;
        private final String contentType;

        public AttachmentDownload(Resource resource, String fileName, String contentType) {
            this.resource = resource;
            this.fileName = fileName;
            this.contentType = contentType;
        }

        public Resource getResource() { return resource; }
        public String getFileName() { return fileName; }
        public String getContentType() { return contentType; }
    }
}
