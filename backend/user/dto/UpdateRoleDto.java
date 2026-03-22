package user.dto;

import javax.validation.constraints.NotNull;
import user.entity.Role;

public class UpdateRoleDto {
    @NotNull(message = "Role is required")
    private Role role;

    // Constructors
    public UpdateRoleDto() {}

    // Getters and Setters
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}