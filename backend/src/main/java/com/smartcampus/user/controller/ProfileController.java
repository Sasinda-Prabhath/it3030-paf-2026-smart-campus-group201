package com.smartcampus.user.controller;

import com.smartcampus.user.dto.ProfileDto;
import com.smartcampus.user.dto.UpdateProfileDto;
import com.smartcampus.user.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<ProfileDto> getMyProfile() {
        ProfileDto profile = profileService.getCurrentUserProfile();
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileDto> updateMyProfile(@Valid @RequestBody UpdateProfileDto updateDto) {
        ProfileDto updatedProfile = profileService.updateCurrentUserProfile(updateDto);
        return ResponseEntity.ok(updatedProfile);
    }
}