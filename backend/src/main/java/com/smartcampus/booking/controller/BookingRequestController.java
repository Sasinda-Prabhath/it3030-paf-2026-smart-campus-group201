package com.smartcampus.booking.controller;

import com.smartcampus.booking.dto.BookingRequestDto;
import com.smartcampus.booking.dto.CreateBookingRequestDto;
import com.smartcampus.booking.dto.UpdateBookingRequestDto;
import com.smartcampus.booking.service.BookingRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingRequestController {

    @Autowired
    private BookingRequestService bookingRequestService;

    @GetMapping
    public ResponseEntity<List<BookingRequestDto>> getBookings() {
        return ResponseEntity.ok(bookingRequestService.getVisibleRequests());
    }

    @PostMapping
    public ResponseEntity<BookingRequestDto> createBooking(@Valid @RequestBody CreateBookingRequestDto dto) {
        return ResponseEntity.ok(bookingRequestService.create(dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<BookingRequestDto> updateBooking(
        @PathVariable @NonNull Long id,
        @Valid @RequestBody UpdateBookingRequestDto dto
    ) {
        return ResponseEntity.ok(bookingRequestService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable @NonNull Long id) {
        bookingRequestService.delete(id);
        return ResponseEntity.noContent().build();
    }
}