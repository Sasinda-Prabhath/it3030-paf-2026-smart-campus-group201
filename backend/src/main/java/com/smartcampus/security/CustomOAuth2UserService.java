package com.smartcampus.security;

import com.smartcampus.user.entity.Role;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Loads the user from Google's OAuth2 response and persists/updates them in our database.
 * If a user logs in for the first time with their Google account, a new User record is created
 * with the default role USER.
 */
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");
        Boolean emailVerified = oAuth2User.getAttribute("email_verified");

        Optional<User> existing = userRepository.findByEmail(email);

        User user;
        if (existing.isPresent()) {
            // Update profile image if changed
            user = existing.get();
            if (picture != null && !picture.equals(user.getProfileImageUrl())) {
                user.setProfileImageUrl(picture);
                userRepository.save(user);
            }
        } else {
            // First-time login: create user record
            user = new User();
            user.setEmail(email);
            user.setFullName(name);
            user.setProfileImageUrl(picture);
            // First user becomes ADMIN, others USER
            user.setRole(userRepository.count() == 0 ? Role.ADMIN : Role.USER);
            user.setEmailVerified(Boolean.TRUE.equals(emailVerified));
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        }

        return oAuth2User;
    }
}
