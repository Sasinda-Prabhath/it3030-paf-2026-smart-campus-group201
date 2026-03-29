package com.smartcampus.ticket.repository;

import com.smartcampus.ticket.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedByEmailOrderByCreatedAtDesc(String createdByEmail);
}
