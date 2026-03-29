package com.smartcampus.booking.repository;

import com.smartcampus.booking.entity.BookingRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRequestRepository extends JpaRepository<BookingRequest, Long> {
    List<BookingRequest> findAllByOrderByRequestedAtDesc();
    List<BookingRequest> findByRequesterEmailOrderByRequestedAtDesc(String requesterEmail);
}