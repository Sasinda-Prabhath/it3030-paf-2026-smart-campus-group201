package com.smartcampus.resource.dto;

public class ResourceItemDto {
    private String id;
    private String name;
    private String type;
    private Integer capacity;
    private String location;
    private String availabilityWindow;
    private String status;
    private String availableFromDate;
    private String availableToDate;
    private String unavailableFromDate;
    private String unavailableToDate;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAvailabilityWindow() {
        return availabilityWindow;
    }

    public void setAvailabilityWindow(String availabilityWindow) {
        this.availabilityWindow = availabilityWindow;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAvailableFromDate() {
        return availableFromDate;
    }

    public void setAvailableFromDate(String availableFromDate) {
        this.availableFromDate = availableFromDate;
    }

    public String getAvailableToDate() {
        return availableToDate;
    }

    public void setAvailableToDate(String availableToDate) {
        this.availableToDate = availableToDate;
    }

    public String getUnavailableFromDate() {
        return unavailableFromDate;
    }

    public void setUnavailableFromDate(String unavailableFromDate) {
        this.unavailableFromDate = unavailableFromDate;
    }

    public String getUnavailableToDate() {
        return unavailableToDate;
    }

    public void setUnavailableToDate(String unavailableToDate) {
        this.unavailableToDate = unavailableToDate;
    }
}
