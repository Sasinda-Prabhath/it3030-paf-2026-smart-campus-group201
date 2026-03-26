package com.smartcampus.user.dto;

import com.smartcampus.user.entity.UserType;

public class UpdateClassificationDto {
    private UserType userType;

    // Constructors
    public UpdateClassificationDto() {}

    // Getters and Setters
    public UserType getUserType() { return userType; }
    public void setUserType(UserType userType) { this.userType = userType; }
}