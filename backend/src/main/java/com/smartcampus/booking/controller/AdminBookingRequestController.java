package com.smartcampus.booking.controller;

import com.smartcampus.booking.dto.BookingRequestDto;
import com.smartcampus.booking.dto.ReviewBookingRequestDto;
import com.smartcampus.booking.service.BookingRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/bookings")
@PreAuthorize("hasRole('ADMIN')")
public class AdminBookingRequestController {

    @Autowired
    private BookingRequestService bookingRequestService;

    @PatchMapping("/{id}/review")
    public ResponseEntity<BookingRequestDto> reviewBooking(
        @PathVariable @NonNull Long id,
        @Valid @RequestBody ReviewBookingRequestDto dto
    ) {
        return ResponseEntity.ok(bookingRequestService.review(id, dto));
    }
}