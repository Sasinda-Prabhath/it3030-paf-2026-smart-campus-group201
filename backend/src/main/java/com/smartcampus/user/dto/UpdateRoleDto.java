package com.smartcampus.user.dto;

import jakarta.validation.constraints.NotNull;
import com.smartcampus.user.entity.Role;

public class UpdateRoleDto {
    @NotNull(message = "Role is required")
    private Role role;

    // Constructors
    public UpdateRoleDto() {}

    // Getters and Setters
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}