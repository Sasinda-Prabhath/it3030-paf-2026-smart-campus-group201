package com.smartcampus.verification.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;


import com.smartcampus.common.exception.BadRequestException;
import com.smartcampus.common.exception.ResourceNotFoundException;
import com.smartcampus.mail.service.MailService;
import com.smartcampus.notification.entity.NotificationType;
import com.smartcampus.notification.service.NotificationService;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.repository.UserRepository;
import com.smartcampus.verification.entity.VerificationToken;
import com.smartcampus.verification.repository.VerificationTokenRepository;
@Service
public class VerificationService {

    private final VerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final MailService mailService;
    private final NotificationService notificationService;

    public VerificationService(VerificationTokenRepository tokenRepository,
                               UserRepository userRepository,
                               MailService mailService,
                               NotificationService notificationService) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.notificationService = notificationService;
    }

    @Value("${app.frontend-url}")
    private String frontendUrl;

    /** Create a token, save it, and send a verification email. */
    @Transactional
    public void sendEmailVerification(User user) {
        String rawToken = UUID.randomUUID().toString();

        VerificationToken token = new VerificationToken(
                null,
                rawToken,
                user,
                LocalDateTime.now().plusHours(24),
                false
        );
        tokenRepository.save(token);

        String link = frontendUrl + "/verify-email?token=" + rawToken;
        mailService.sendVerificationEmail(user.getEmail(), link);
    }

    /** Consume the token and mark the user's email as verified. */
    @Transactional
    public void verifyEmail(String rawToken) {
        VerificationToken token = tokenRepository.findByTokenAndUsedFalse(rawToken)
                .orElseThrow(() -> new BadRequestException("Invalid or expired verification token"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification token has expired");
        }

        User user = token.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);

        // Create an in-app notification
        notificationService.createNotification(
                user,
                "Email Verified",
                "Your email address has been successfully verified.",
                NotificationType.PROFILE_VERIFICATION
        );
    }
}
