package com.smartcampus.profile.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.smartcampus.common.exception.BadRequestException;
import com.smartcampus.profile.dto.ProfileResponse;
import com.smartcampus.profile.dto.UpdateProfileRequest;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.repository.UserRepository;
import com.smartcampus.verification.service.VerificationService;
@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final VerificationService verificationService;

    public ProfileService(UserRepository userRepository, VerificationService verificationService) {
        this.userRepository = userRepository;
        this.verificationService = verificationService;
    }

    public ProfileResponse getProfile(User user) {
        return toResponse(user);
    }

    @Transactional
    public ProfileResponse updateProfile(User user, UpdateProfileRequest request) {
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        if (request.getProfileImageUrl() != null) {
            user.setProfileImageUrl(request.getProfileImageUrl());
        }
        return toResponse(userRepository.save(user));
    }

    /** Trigger sending a verification email for the user's email address. */
    public void sendVerificationEmail(User user) {
        if (user.isEmailVerified()) {
            throw new BadRequestException("Email is already verified");
        }
        verificationService.sendEmailVerification(user);
    }

    private ProfileResponse toResponse(User user) {
        return new ProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getProfileImageUrl(),
                user.getRole(),
                user.isEmailVerified(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
