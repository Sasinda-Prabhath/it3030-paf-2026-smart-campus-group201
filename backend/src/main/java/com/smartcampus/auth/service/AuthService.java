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
        try{
            String email = oauth2User.getAttribute("email");
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setRole(determineInitialRole(email));
                user.setUserType(classifyUserType(email));
                
                // Set account status based on email domain
                if (email != null &&email.endsWith("@my.sliit.lk") || email.endsWith("@sliit.lk") || "path2intern@gmail.com".equals(email)) {
                    user.setAccountStatus(AccountStatus.ACTIVE);
                } else {
                    user.setAccountStatus(AccountStatus.PENDING_APPROVAL);
                }
                
                user.setCreatedAt(LocalDateTime.now());
            }

            user.setFullName(oauth2User.getAttribute("name"));
            user.setProfileImageUrl(oauth2User.getAttribute("picture"));
            user.setEmailVerified(oauth2User.getAttribute("email_verified"));
            user.setUpdatedAt(LocalDateTime.now());

            return userRepository.save(user);
        } catch (Exception e) {
            System.out.println("CRASH DURING OAUTH2 SAVE: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private Role determineInitialRole(String email) {
        // System admin email is always ADMIN
        if ("path2intern@gmail.com".equals(email)) {
            return Role.ADMIN;
        }
        // All other users start as USER
        return Role.USER;
    }

    private UserType classifyUserType(String email) {
        if (email == null) {
            return null; // Or a default type if you have one for non-domain emails
        }
        // Students have my.sliit.lk email
        if (email.endsWith("@my.sliit.lk")) {
            return UserType.STUDENT;
        }
        // Lecturers have sliit.lk email
        if (email.endsWith("@sliit.lk")) {
            return UserType.LECTURER;
        }
        // No specific type for other emails
        return null;
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}