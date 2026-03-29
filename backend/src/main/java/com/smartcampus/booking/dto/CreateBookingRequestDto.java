package com.smartcampus.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public class CreateBookingRequestDto {

    @NotBlank
    private String resourceId;

    @NotBlank
    private String resourceName;

    @NotBlank
    private String resourceType;

    @NotBlank
    private String location;

    @NotNull
    private LocalDate bookingDate;

    private String timeRange;

    @NotBlank
    private String purpose;

    @Positive
    private Integer attendees;

    @Positive
    private Integer expectedAmount;

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public String getResourceName() { return resourceName; }
    public void setResourceName(String resourceName) { this.resourceName = resourceName; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public String getTimeRange() { return timeRange; }
    public void setTimeRange(String timeRange) { this.timeRange = timeRange; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public Integer getAttendees() { return attendees; }
    public void setAttendees(Integer attendees) { this.attendees = attendees; }

    public Integer getExpectedAmount() { return expectedAmount; }
    public void setExpectedAmount(Integer expectedAmount) { this.expectedAmount = expectedAmount; }
}