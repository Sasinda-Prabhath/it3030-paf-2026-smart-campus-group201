package com.smartcampus.booking.service;

import com.smartcampus.booking.dto.BookingRequestDto;
import com.smartcampus.booking.dto.CreateBookingRequestDto;
import com.smartcampus.booking.dto.ReviewBookingRequestDto;
import com.smartcampus.booking.dto.UpdateBookingRequestDto;
import com.smartcampus.booking.entity.BookingRequest;
import com.smartcampus.booking.entity.BookingStatus;
import com.smartcampus.booking.repository.BookingRequestRepository;
import com.smartcampus.common.security.CurrentUserService;
import com.smartcampus.user.entity.Role;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingRequestService {

    @Autowired
    private BookingRequestRepository bookingRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CurrentUserService currentUserService;

    public List<BookingRequestDto> getVisibleRequests() {
        User currentUser = getCurrentUser();
        List<BookingRequest> requests = currentUser.getRole() == Role.ADMIN
            ? bookingRequestRepository.findAllByOrderByRequestedAtDesc()
            : bookingRequestRepository.findByRequesterEmailOrderByRequestedAtDesc(currentUser.getEmail());

        return requests.stream().map(this::mapToDto).toList();
    }

    public BookingRequestDto create(@NonNull CreateBookingRequestDto dto) {
        User currentUser = getCurrentUser();

        BookingRequest request = new BookingRequest();
        request.setResourceId(dto.getResourceId());
        request.setResourceName(dto.getResourceName());
        request.setResourceType(dto.getResourceType());
        request.setLocation(dto.getLocation());
        request.setRequesterName(currentUser.getFullName());
        request.setRequesterEmail(currentUser.getEmail());
        request.setBookingDate(dto.getBookingDate());
        request.setTimeRange(normalizeText(dto.getTimeRange()));
        request.setPurpose(dto.getPurpose().trim());
        request.setAttendees(dto.getAttendees());
        request.setExpectedAmount(dto.getExpectedAmount());
        request.setStatus(BookingStatus.PENDING);
        request.setAdminReason("");
        request.setRequestedAt(LocalDateTime.now());
        request.setReviewedAt(null);
        request.setReviewedBy("");

        return mapToDto(bookingRequestRepository.save(request));
    }

    public BookingRequestDto review(@NonNull Long id, @NonNull ReviewBookingRequestDto dto) {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only admins can review booking requests");
        }

        BookingStatus nextStatus;
        try {
            nextStatus = BookingStatus.valueOf(dto.getStatus().trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Invalid booking status");
        }

        if (nextStatus == BookingStatus.PENDING) {
            throw new IllegalArgumentException("Booking review status must be APPROVED or REJECTED");
        }

        BookingRequest request = bookingRequestRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Booking request not found"));

        request.setStatus(nextStatus);
        request.setAdminReason(dto.getReason().trim());
        request.setReviewedAt(LocalDateTime.now());
        request.setReviewedBy(currentUser.getFullName() != null && !currentUser.getFullName().isBlank()
            ? currentUser.getFullName()
            : currentUser.getEmail());

        return mapToDto(bookingRequestRepository.save(request));
    }

    public BookingRequestDto update(@NonNull Long id, @NonNull UpdateBookingRequestDto dto) {
        User currentUser = getCurrentUser();
        BookingRequest request = getOwnedPendingRequest(id, currentUser);

        request.setBookingDate(dto.getBookingDate());
        request.setTimeRange(normalizeText(dto.getTimeRange()));
        request.setPurpose(dto.getPurpose().trim());
        request.setAttendees(dto.getAttendees());
        request.setExpectedAmount(dto.getExpectedAmount());

        return mapToDto(bookingRequestRepository.save(request));
    }

    public void delete(@NonNull Long id) {
        User currentUser = getCurrentUser();
        BookingRequest request = getOwnedPendingRequest(id, currentUser);
        bookingRequestRepository.delete(request);
    }

    private User getCurrentUser() {
        String email = currentUserService.getCurrentUserEmail();
        if (email == null || email.isBlank()) {
            throw new AccessDeniedException("No authenticated user found");
        }

        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Current user not found"));
    }

    private BookingRequest getOwnedPendingRequest(Long id, User currentUser) {
        BookingRequest request = bookingRequestRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Booking request not found"));

        if (!currentUser.getEmail().equalsIgnoreCase(request.getRequesterEmail())) {
            throw new AccessDeniedException("You can only modify your own booking requests");
        }

        if (request.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only pending booking requests can be updated or deleted");
        }

        return request;
    }

    private BookingRequestDto mapToDto(BookingRequest request) {
        BookingRequestDto dto = new BookingRequestDto();
        dto.setId(request.getId());
        dto.setResourceId(request.getResourceId());
        dto.setResourceName(request.getResourceName());
        dto.setResourceType(request.getResourceType());
        dto.setLocation(request.getLocation());
        dto.setRequesterName(request.getRequesterName());
        dto.setRequesterEmail(request.getRequesterEmail());
        dto.setBookingDate(request.getBookingDate() != null ? request.getBookingDate().toString() : "");
        dto.setTimeRange(normalizeText(request.getTimeRange()));
        dto.setPurpose(request.getPurpose());
        dto.setAttendees(request.getAttendees());
        dto.setExpectedAmount(request.getExpectedAmount());
        dto.setStatus(request.getStatus().name());
        dto.setAdminReason(normalizeText(request.getAdminReason()));
        dto.setRequestedAt(request.getRequestedAt() != null ? request.getRequestedAt().toString() : "");
        dto.setReviewedAt(request.getReviewedAt() != null ? request.getReviewedAt().toString() : "");
        dto.setReviewedBy(normalizeText(request.getReviewedBy()));
        return dto;
    }

    private String normalizeText(String value) {
        return value == null ? "" : value.trim();
    }
}