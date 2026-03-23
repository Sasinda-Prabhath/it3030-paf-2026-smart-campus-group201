package com.smartcampus.user.service;

import com.smartcampus.user.dto.ProfileDto;
import com.smartcampus.user.dto.UpdateProfileDto;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.repository.UserRepository;
import com.smartcampus.common.security.CurrentUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CurrentUserService currentUserService;

    public ProfileDto getCurrentUserProfile() {
        String email = currentUserService.getCurrentUserEmail();
        if (email == null) {
            throw new RuntimeException("User not authenticated");
        }

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return mapToProfileDto(user);
    }

    public ProfileDto updateCurrentUserProfile(UpdateProfileDto updateDto) {
        String email = currentUserService.getCurrentUserEmail();
        if (email == null) {
            throw new RuntimeException("User not authenticated");
        }

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(updateDto.getFullName());
        user.setProfileImageUrl(updateDto.getProfileImageUrl());
        user.setUpdatedAt(LocalDateTime.now());

        user = userRepository.save(user);
        return mapToProfileDto(user);
    }

    private ProfileDto mapToProfileDto(User user) {
        ProfileDto dto = new ProfileDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setUserType(user.getUserType() != null ? user.getUserType().name() : null);
        dto.setStaffType(user.getStaffType() != null ? user.getStaffType().name() : null);
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setEmailVerified(user.getEmailVerified());
        dto.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        dto.setUpdatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null);
        return dto;
    }
}