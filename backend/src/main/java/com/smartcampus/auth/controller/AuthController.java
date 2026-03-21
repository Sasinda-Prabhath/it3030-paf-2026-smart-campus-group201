package com.smartcampus.auth.controller;

import com.smartcampus.auth.dto.AuthUserResponse;
import com.smartcampus.auth.service.AuthService;
import com.smartcampus.common.util.ApiResponse;
import com.smartcampus.user.entity.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Auth endpoints:
 * GET  /api/auth/me     â€“ returns the currently authenticated user
 * POST /api/auth/logout â€“ clears the accessToken cookie
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthUserResponse>> getMe(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(authService.buildAuthUserResponse(user)));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        // Clear the HttpOnly accessToken cookie by setting max-age to 0
        Cookie cookie = new Cookie("accessToken", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok(ApiResponse.successMessage("Logged out successfully"));
    }
}
