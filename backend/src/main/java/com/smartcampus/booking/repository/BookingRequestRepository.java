package com.smartcampus.booking.repository;

import com.smartcampus.booking.entity.BookingRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRequestRepository extends JpaRepository<BookingRequest, Long> {
    List<BookingRequest> findAllByOrderByRequestedAtDesc();
    List<BookingRequest> findByRequesterEmailOrderByRequestedAtDesc(String requesterEmail);
    List<BookingRequest> findByResourceIdAndBookingDateAndStatusIn(String resourceId, java.time.LocalDate bookingDate, List<com.smartcampus.booking.entity.BookingStatus> statuses);
}