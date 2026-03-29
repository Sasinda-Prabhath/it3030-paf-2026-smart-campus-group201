package com.smartcampus.ticket.repository;

import com.smartcampus.ticket.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @Query("SELECT t FROM Ticket t WHERE LOWER(TRIM(t.createdByEmail)) = LOWER(TRIM(:createdByEmail)) ORDER BY t.createdAt DESC")
    List<Ticket> findByCreatedByEmailOrderByCreatedAtDesc(@Param("createdByEmail") String createdByEmail);

    @Query("SELECT t FROM Ticket t WHERE LOWER(TRIM(t.assignedToEmail)) = LOWER(TRIM(:assignedToEmail)) ORDER BY t.updatedAt DESC")
    List<Ticket> findByAssignedToEmailOrderByUpdatedAtDesc(@Param("assignedToEmail") String assignedToEmail);

    @Query("SELECT t FROM Ticket t WHERE t.assignedToEmail IS NOT NULL AND TRIM(t.assignedToEmail) <> '' ORDER BY t.updatedAt DESC")
    List<Ticket> findAssignedQueueOrderByUpdatedAtDesc();

    List<Ticket> findAllByOrderByCreatedAtDesc();
}
