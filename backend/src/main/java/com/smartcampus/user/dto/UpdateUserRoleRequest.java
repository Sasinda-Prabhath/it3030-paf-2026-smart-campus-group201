package com.smartcampus.user.dto;

import com.smartcampus.user.entity.Role;
import jakarta.validation.constraints.NotNull;

/** Request body for updating a user's role (admin-only). */
public class UpdateUserRoleRequest {
    @NotNull(message = "Role is required")
    private Role role;

    public UpdateUserRoleRequest() {}
    public UpdateUserRoleRequest(Role role) { this.role = role;}

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
