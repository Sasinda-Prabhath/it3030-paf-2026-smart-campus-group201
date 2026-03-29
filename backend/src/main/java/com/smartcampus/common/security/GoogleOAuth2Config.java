package com.smartcampus.common.security;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

// Skeleton for Google OAuth2 configuration
// Only loaded if OAuth2 properties are configured
// TODO: Implement full OAuth2 user mapping in auth module
@Component
@ConditionalOnProperty(
    name = "spring.security.oauth2.client.registration.google.client-id"
)
public class GoogleOAuth2Config {

    // Placeholder for OAuth2 authorization request customization
    public OAuth2AuthorizationRequestResolver authorizationRequestResolver(
            ClientRegistrationRepository clientRegistrationRepository) {

        DefaultOAuth2AuthorizationRequestResolver resolver =
            new DefaultOAuth2AuthorizationRequestResolver(
                clientRegistrationRepository, "/oauth2/authorization");

        resolver.setAuthorizationRequestCustomizer(customizer -> {
            // Add custom parameters if needed
            Map<String, Object> additionalParameters = new HashMap<>();
            additionalParameters.put("access_type", "offline");
            customizer.additionalParameters(additionalParameters);
        });

        return resolver;
    }
}