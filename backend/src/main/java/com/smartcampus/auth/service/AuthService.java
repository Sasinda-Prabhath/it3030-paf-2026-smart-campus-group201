package com.smartcampus.auth.service;

import com.smartcampus.user.entity.User;
import com.smartcampus.user.entity.Role;
import com.smartcampus.user.entity.UserType;
import com.smartcampus.user.entity.AccountStatus;
import com.smartcampus.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User createOrUpdateUser(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setRole(determineInitialRole());
            user.setUserType(classifyUserType(email));
            user.setAccountStatus(AccountStatus.ACTIVE);
            user.setCreatedAt(LocalDateTime.now());
        }

        user.setFullName(oauth2User.getAttribute("name"));
        user.setProfileImageUrl(oauth2User.getAttribute("picture"));
        user.setEmailVerified(oauth2User.getAttribute("email_verified"));
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    private Role determineInitialRole() {
        return userRepository.count() == 0 ? Role.ADMIN : Role.USER;
    }

    private UserType classifyUserType(String email) {
        if (email != null && email.endsWith("@my.sliit.lk")) {
            return UserType.STUDENT;
        }
        return UserType.STUDENT; // Default to STUDENT, admin can change later
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}