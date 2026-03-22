package user.controller;

import user.dto.UserListDto;
import user.dto.UpdateRoleDto;
import user.dto.UpdateClassificationDto;
import user.service.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<UserListDto>> getAllUsers() {
        List<UserListDto> users = adminUserService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<UserListDto> updateUserRole(@PathVariable Long id, @Valid @RequestBody UpdateRoleDto updateDto) {
        UserListDto user = adminUserService.updateUserRole(id, updateDto);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{id}/classification")
    public ResponseEntity<UserListDto> updateUserClassification(@PathVariable Long id, @Valid @RequestBody UpdateClassificationDto updateDto) {
        UserListDto user = adminUserService.updateUserClassification(id, updateDto);
        return ResponseEntity.ok(user);
    }
}