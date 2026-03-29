package com.smartcampus.ticket.repository;

import com.smartcampus.ticket.entity.TicketAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {
    List<TicketAttachment> findByTicketIdOrderByUploadedAtAsc(Long ticketId);
    Optional<TicketAttachment> findByIdAndTicketId(Long id, Long ticketId);
}
