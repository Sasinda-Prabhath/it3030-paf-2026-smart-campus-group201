package com.smartcampus.mail.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class MailService {

    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Value("${app.mail.from}")
    private String from;

    /**
     * Send a plain text email.
     *
     * @param to      recipient email address
     * @param subject email subject
     * @param body    plain text body
     */
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    /** Convenience method for sending a verification link email. */
    public void sendVerificationEmail(String to, String verificationLink) {
        String subject = "Smart Campus – Verify your email address";
        String body = """
                Hello,
                
                Please verify your email address by clicking the link below:
                
                %s
                
                This link expires in 24 hours.
                
                If you did not request this, please ignore this email.
                
                – Smart Campus Team
                """.formatted(verificationLink);
        sendEmail(to, subject, body);
    }

    /** Send a welcome / account-created email. */
    public void sendWelcomeEmail(String to, String fullName) {
        String subject = "Welcome to Smart Campus!";
        String body = """
                Hello %s,
                
                Welcome to Smart Campus Management System!
                Your account has been created successfully via Google Sign-In.
                
                Please verify your email address in your profile settings.
                
                – Smart Campus Team
                """.formatted(fullName);
        sendEmail(to, subject, body);
    }
}
