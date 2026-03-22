package common.security;

import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

// Skeleton for Google OAuth2 configuration
// TODO: Implement full OAuth2 user mapping in auth module
@Component
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