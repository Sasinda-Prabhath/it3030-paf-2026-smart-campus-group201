package com.smartcampus.auth.service;

import com.smartcampus.auth.dto.AuthUserResponse;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserService userService;

    public AuthService(UserService userService) {
        this.userService = userService;
    }

    /** Build the AuthUserResponse from the currently authenticated User entity. */
    public AuthUserResponse buildAuthUserResponse(User user) {
        return new AuthUserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getProfileImageUrl(),
                user.getRole(),
                user.isEmailVerified(),
                user.getCreatedAt()
        );
    }
}
