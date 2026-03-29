package com.smartcampus.common.security;

import com.smartcampus.auth.service.AuthService;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Value("${FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        
        // Create or update user in database
        authService.createOrUpdateUser(oauth2User);
        
        // Load the user with their actual role from the database
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user != null) {
            // Create authorities based on the user's role from database
            Collection<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
            
            // Create a new OAuth2User with updated authorities
            DefaultOAuth2User updatedOAuth2User = new DefaultOAuth2User(
                authorities,
                oauth2User.getAttributes(),
                "email"
            );
            
            // Create a new authentication object with the proper authorities
            org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken authToken = 
                new org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken(
                    updatedOAuth2User,
                    authorities,
                    ((org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId()
                );
            
            authToken.setDetails(authentication.getDetails());
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        response.sendRedirect(frontendUrl);
    }
}