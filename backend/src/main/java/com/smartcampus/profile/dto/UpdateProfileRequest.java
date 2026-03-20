package com.smartcampus.profile.dto;

import jakarta.validation.constraints.Size;

/** Request body for updating a user's own profile. */
public class UpdateProfileRequest {

    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    private String profileImageUrl;

    public UpdateProfileRequest() {}
    public UpdateProfileRequest(String fullName, String profileImageUrl) {
        this.fullName = fullName;
        this.profileImageUrl = profileImageUrl;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
}
