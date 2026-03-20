package com.smartcampus.verification.controller;

import com.smartcampus.common.util.ApiResponse;
import com.smartcampus.verification.service.VerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public endpoint to verify email from the token in the link sent by email.
 * GET /api/profile/verify?token=...
 */
@RestController
@RequestMapping("/api/profile")
public class VerificationController {

    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam String token) {
        verificationService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.successMessage("Email verified successfully"));
    }
}
