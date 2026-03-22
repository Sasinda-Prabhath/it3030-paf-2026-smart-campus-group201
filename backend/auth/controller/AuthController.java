package auth.controller;

import auth.dto.CurrentUserDto;
import auth.service.AuthService;
import common.security.CurrentUserService;
import user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private CurrentUserService currentUserService;

    @Autowired
    private AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<CurrentUserDto> getCurrentUser() {
        String email = currentUserService.getCurrentUserEmail();
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = authService.findUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CurrentUserDto dto = new CurrentUserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole().name());
        dto.setUserType(user.getUserType() != null ? user.getUserType().name() : null);
        dto.setStaffType(user.getStaffType() != null ? user.getStaffType().name() : null);
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setEmailVerified(user.getEmailVerified());

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        new SecurityContextLogoutHandler().logout(request, response, null);
        return ResponseEntity.ok().build();
    }
}