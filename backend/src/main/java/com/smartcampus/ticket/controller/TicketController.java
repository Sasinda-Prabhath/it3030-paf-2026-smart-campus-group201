package com.smartcampus.ticket.controller;

import com.smartcampus.ticket.dto.AddTicketCommentDto;
import com.smartcampus.ticket.dto.AssignTicketDto;
import com.smartcampus.ticket.dto.CreateTicketDto;
import com.smartcampus.ticket.dto.TicketAttachmentDto;
import com.smartcampus.ticket.dto.TicketCommentDto;
import com.smartcampus.ticket.dto.TicketDetailDto;
import com.smartcampus.ticket.dto.TicketDto;
import com.smartcampus.ticket.dto.UpdateTicketDto;
import com.smartcampus.ticket.dto.UpdateTicketStatusDto;
import com.smartcampus.ticket.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<TicketDto> createTicket(@Valid @RequestBody CreateTicketDto dto) {
        return ResponseEntity.ok(ticketService.create(dto));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TicketDto>> getMyTickets() {
        return ResponseEntity.ok(ticketService.getMyTickets());
    }

    @GetMapping("/my/{id}")
    public ResponseEntity<TicketDetailDto> getMyTicket(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(ticketService.getMyTicket(id));
    }

    @PutMapping("/my/{id}")
    public ResponseEntity<TicketDto> updateMyTicket(
        @PathVariable @NonNull Long id,
        @Valid @RequestBody UpdateTicketDto dto
    ) {
        return ResponseEntity.ok(ticketService.updateMyTicket(id, dto));
    }

    @DeleteMapping("/my/{id}")
    public ResponseEntity<Void> deleteMyTicket(@PathVariable @NonNull Long id) {
        ticketService.deleteMyTicket(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/my/{id}/comments")
    public ResponseEntity<TicketCommentDto> addComment(
        @PathVariable @NonNull Long id,
        @Valid @RequestBody AddTicketCommentDto dto
    ) {
        return ResponseEntity.ok(ticketService.addComment(id, dto));
    }

    @PostMapping(value = "/my/{id}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketAttachmentDto> uploadAttachment(
        @PathVariable @NonNull Long id,
        @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(ticketService.uploadAttachment(id, file));
    }

    @GetMapping("/my/{ticketId}/attachments/{attachmentId}")
    public ResponseEntity<Resource> downloadAttachment(
        @PathVariable @NonNull Long ticketId,
        @PathVariable @NonNull Long attachmentId
    ) {
        TicketService.AttachmentDownload download = ticketService.downloadAttachment(ticketId, attachmentId);

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(download.getContentType()))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + download.getFileName() + "\"")
            .body(download.getResource());
    }

    @DeleteMapping("/my/{ticketId}/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(
        @PathVariable @NonNull Long ticketId,
        @PathVariable @NonNull Long attachmentId
    ) {
        ticketService.deleteAttachment(ticketId, attachmentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<TicketDto>> getAssignedTickets() {
        return ResponseEntity.ok(ticketService.getAssignedTickets());
    }

    @GetMapping("/assigned/{id}")
    public ResponseEntity<TicketDetailDto> getAssignedTicket(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(ticketService.getAssignedTicket(id));
    }

    @PatchMapping("/assigned/{id}/status")
    public ResponseEntity<TicketDto> updateAssignedTicketStatus(
        @PathVariable @NonNull Long id,
        @Valid @RequestBody UpdateTicketStatusDto dto
    ) {
        return ResponseEntity.ok(ticketService.updateAssignedTicketStatus(id, dto));
    }

    @PostMapping("/assigned/{id}/comments")
    public ResponseEntity<TicketCommentDto> addCommentToAssignedTicket(
        @PathVariable @NonNull Long id,
        @Valid @RequestBody AddTicketCommentDto dto
    ) {
        return ResponseEntity.ok(ticketService.addCommentToAssignedTicket(id, dto));
    }

    @PostMapping(value = "/assigned/{id}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketAttachmentDto> uploadAttachmentToAssignedTicket(
        @PathVariable @NonNull Long id,
        @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(ticketService.uploadAttachmentToAssignedTicket(id, file));
    }

    @GetMapping("/assigned/{ticketId}/attachments/{attachmentId}")
    public ResponseEntity<Resource> downloadAttachmentForAssignedTicket(
        @PathVariable @NonNull Long ticketId,
        @PathVariable @NonNull Long attachmentId
    ) {
        TicketService.AttachmentDownload download = ticketService.downloadAttachmentForAssignedTicket(ticketId, attachmentId);

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(download.getContentType()))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + download.getFileName() + "\"")
            .body(download.getResource());
    }

    @DeleteMapping("/assigned/{ticketId}/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachmentFromAssignedTicket(
        @PathVariable @NonNull Long ticketId,
        @PathVariable @NonNull Long attachmentId
    ) {
        ticketService.deleteAttachmentFromAssignedTicket(ticketId, attachmentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin")
    public ResponseEntity<List<TicketDto>> getAllTicketsForAdmin() {
        return ResponseEntity.ok(ticketService.getAllTicketsForAdmin());
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<TicketDetailDto> getTicketForAdmin(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(ticketService.getTicketForAdmin(id));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteTicketAsAdmin(@PathVariable @NonNull Long id) {
        ticketService.deleteTicketAsAdmin(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/admin/{id}/assign")
    public ResponseEntity<TicketDto> assignTicket(
        @PathVariable @NonNull Long id,
        @Valid @RequestBody AssignTicketDto dto
    ) {
        return ResponseEntity.ok(ticketService.assignTicket(id, dto));
    }

    @PatchMapping("/admin/{id}/status")
    public ResponseEntity<TicketDto> updateTicketStatusForAdmin(
        @PathVariable @NonNull Long id,
        @Valid @RequestBody UpdateTicketStatusDto dto
    ) {
        return ResponseEntity.ok(ticketService.updateTicketStatusForAdmin(id, dto));
    }

    @PostMapping("/admin/{id}/comments")
    public ResponseEntity<TicketCommentDto> addCommentToTicketAsAdmin(
        @PathVariable @NonNull Long id,
        @Valid @RequestBody AddTicketCommentDto dto
    ) {
        return ResponseEntity.ok(ticketService.addCommentToTicketAsAdmin(id, dto));
    }

    @PostMapping(value = "/admin/{id}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketAttachmentDto> uploadAttachmentToTicketAsAdmin(
        @PathVariable @NonNull Long id,
        @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(ticketService.uploadAttachmentToTicketAsAdmin(id, file));
    }

    @GetMapping("/admin/{ticketId}/attachments/{attachmentId}")
    public ResponseEntity<Resource> downloadAttachmentForAdmin(
        @PathVariable @NonNull Long ticketId,
        @PathVariable @NonNull Long attachmentId
    ) {
        TicketService.AttachmentDownload download = ticketService.downloadAttachmentForAdmin(ticketId, attachmentId);

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(download.getContentType()))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + download.getFileName() + "\"")
            .body(download.getResource());
    }

    @DeleteMapping("/admin/{ticketId}/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachmentFromTicketAsAdmin(
        @PathVariable @NonNull Long ticketId,
        @PathVariable @NonNull Long attachmentId
    ) {
        ticketService.deleteAttachmentFromTicketAsAdmin(ticketId, attachmentId);
        return ResponseEntity.noContent().build();
    }
}
