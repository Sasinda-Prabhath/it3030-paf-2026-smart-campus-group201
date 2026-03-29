package com.smartcampus.ticket.service;

import com.smartcampus.common.security.CurrentUserService;
import com.smartcampus.ticket.dto.AddTicketCommentDto;
import com.smartcampus.ticket.dto.CreateTicketDto;
import com.smartcampus.ticket.dto.TicketCommentDto;
import com.smartcampus.ticket.dto.TicketDetailDto;
import com.smartcampus.ticket.dto.TicketDto;
import com.smartcampus.ticket.entity.Ticket;
import com.smartcampus.ticket.entity.TicketComment;
import com.smartcampus.ticket.entity.TicketStatus;
import com.smartcampus.ticket.repository.TicketCommentRepository;
import com.smartcampus.ticket.repository.TicketRepository;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private TicketCommentRepository ticketCommentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CurrentUserService currentUserService;

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

        return detail;
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

    private String normalizeName(User currentUser) {
        return currentUser.getFullName() == null || currentUser.getFullName().isBlank()
            ? currentUser.getEmail()
            : currentUser.getFullName().trim();
    }
}
