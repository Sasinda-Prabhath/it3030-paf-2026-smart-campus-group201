package com.smartcampus.booking.dto;

import jakarta.validation.constraints.NotBlank;

public class ReviewBookingRequestDto {

    @NotBlank
    private String status;

    @NotBlank
    private String reason;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}