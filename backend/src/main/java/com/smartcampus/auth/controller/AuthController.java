package com.smartcampus.auth.controller;

import com.smartcampus.auth.dto.CurrentUserDto;
import com.smartcampus.auth.service.AuthService;
import com.smartcampus.common.security.CurrentUserService;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.entity.Role;
import com.smartcampus.user.entity.UserType;
import com.smartcampus.user.entity.AccountStatus;
import com.smartcampus.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.util.Arrays;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private CurrentUserService currentUserService;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

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
        dto.setAccountStatus(user.getAccountStatus() != null ? user.getAccountStatus().name() : null);
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setEmailVerified(user.getEmailVerified());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        new SecurityContextLogoutHandler().logout(request, response, null);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/demo-login")
    public ResponseEntity<?> demoLogin(@RequestParam String email, HttpServletRequest request, HttpServletResponse response) {
        try {
            // Find or create demo user
            User user = userRepository.findByEmail(email).orElse(null);
            
            if (user == null) {
                // Create new demo user
                user = new User();
                user.setEmail(email);
                user.setFullName(email.split("@")[0].toUpperCase());
                user.setRole(email.contains("admin") ? Role.ADMIN : Role.USER);
                user.setUserType(UserType.STUDENT);
                user.setAccountStatus(AccountStatus.ACTIVE);
                user.setEmailVerified(true);
                user.setCreatedAt(LocalDateTime.now());
                user.setUpdatedAt(LocalDateTime.now());
                user = userRepository.save(user);
            }

            // Store user in final variable for use in HashMap
            final User finalUser = user;

            // Create authentication token with proper authorities
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + finalUser.getRole().name());
            Authentication auth = new UsernamePasswordAuthenticationToken(
                finalUser.getEmail(),
                null,
                Arrays.asList(authority)
            );

            // Set authentication in security context
            SecurityContextHolder.getContext().setAuthentication(auth);

            // Create and store session to persist authentication
            jakarta.servlet.http.HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            // Prepare response data
            java.util.Map<String, Object> responseData = new java.util.HashMap<>();
            responseData.put("status", "success");
            responseData.put("redirectUrl", "http://localhost:5173/");
            
            java.util.Map<String, String> userData = new java.util.HashMap<>();
            userData.put("email", finalUser.getEmail());
            userData.put("fullName", finalUser.getFullName());
            userData.put("role", finalUser.getRole().name());
            responseData.put("user", userData);

            // Return success response
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            e.printStackTrace();
            java.util.Map<String, String> errorData = new java.util.HashMap<>();
            errorData.put("status", "error");
            errorData.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorData);
        }
    }
}