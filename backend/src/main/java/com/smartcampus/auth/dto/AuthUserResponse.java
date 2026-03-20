package com.smartcampus.auth.dto;

import com.smartcampus.user.entity.Role;

import java.time.LocalDateTime;
import java.util.UUID;

/** DTO returned by /api/auth/me – the currently authenticated user. */
public class AuthUserResponse {
    private UUID id;
    private String email;
    private String fullName;
    private String profileImageUrl;
    private Role role;
    private boolean emailVerified;
    private LocalDateTime createdAt;

    public AuthUserResponse() {}

    public AuthUserResponse(UUID id, String email, String fullName, String profileImageUrl, Role role, boolean emailVerified, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.profileImageUrl = profileImageUrl;
        this.role = role;
        this.emailVerified = emailVerified;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
