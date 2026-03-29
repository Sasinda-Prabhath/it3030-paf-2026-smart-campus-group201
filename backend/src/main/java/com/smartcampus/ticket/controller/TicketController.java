package com.smartcampus.ticket.controller;

import com.smartcampus.ticket.dto.AddTicketCommentDto;
import com.smartcampus.ticket.dto.CreateTicketDto;
import com.smartcampus.ticket.dto.TicketCommentDto;
import com.smartcampus.ticket.dto.TicketDetailDto;
import com.smartcampus.ticket.dto.TicketDto;
import com.smartcampus.ticket.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/my/{id}/comments")
    public ResponseEntity<TicketCommentDto> addComment(
        @PathVariable @NonNull Long id,
        @Valid @RequestBody AddTicketCommentDto dto
    ) {
        return ResponseEntity.ok(ticketService.addComment(id, dto));
    }
}
