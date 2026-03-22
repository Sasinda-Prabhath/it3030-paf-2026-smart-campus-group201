package common.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

// Shared service for current user support
// TODO: Integrate with User entity in auth module
@Service
public class CurrentUserService {

    public OAuth2User getCurrentOAuth2User() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof OAuth2User) {
            return (OAuth2User) authentication.getPrincipal();
        }
        return null;
    }

    public String getCurrentUserEmail() {
        OAuth2User oauth2User = getCurrentOAuth2User();
        return oauth2User != null ? oauth2User.getAttribute("email") : null;
    }

    // Placeholder for future User entity integration
    // public User getCurrentUser() { ... }
}