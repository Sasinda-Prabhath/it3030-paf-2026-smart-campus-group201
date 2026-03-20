package com.smartcampus.profile.controller;

import com.smartcampus.common.util.ApiResponse;
import com.smartcampus.profile.dto.ProfileResponse;
import com.smartcampus.profile.dto.UpdateProfileRequest;
import com.smartcampus.profile.service.ProfileService;
import com.smartcampus.user.entity.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Profile endpoints for the authenticated user.
 * GET  /api/profile/me               - view own profile
 * PUT  /api/profile/me               - update own profile
 * POST /api/profile/send-verification - send email verification
 */
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> getMyProfile(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(profileService.getProfile(user)));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateMyProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Profile updated successfully",
                profileService.updateProfile(user, request)
        ));
    }

    @PostMapping("/send-verification")
    public ResponseEntity<ApiResponse<Void>> sendVerification(
            @AuthenticationPrincipal User user) {
        profileService.sendVerificationEmail(user);
        return ResponseEntity.ok(ApiResponse.successMessage("Verification email sent"));
    }
}
