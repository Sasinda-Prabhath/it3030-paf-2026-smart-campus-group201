package com.smartcampus.notification.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


import com.smartcampus.common.exception.ForbiddenException;
import com.smartcampus.common.exception.ResourceNotFoundException;
import com.smartcampus.notification.dto.NotificationResponse;
import com.smartcampus.notification.entity.Notification;
import com.smartcampus.notification.entity.NotificationType;
import com.smartcampus.notification.repository.NotificationRepository;
import com.smartcampus.user.entity.User;
@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /** Public integration hook: other modules (Booking, Ticket) call this to create notifications. */
    public Notification createNotification(User user, String title, String message, NotificationType type) {
        Notification notification = new Notification(
                null,
                user,
                title,
                message,
                type,
                false,
                LocalDateTime.now()
        );
        return notificationRepository.save(notification);
    }

    public List<NotificationResponse> getMyNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::toResponse).toList();
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Transactional
    public NotificationResponse markAsRead(UUID notificationId, User user) {
        Notification n = getAndVerifyOwnership(notificationId, user);
        n.setRead(true);
        return toResponse(notificationRepository.save(n));
    }

    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().filter(n -> !n.isRead()).toList();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void deleteNotification(UUID notificationId, User user) {
        Notification n = getAndVerifyOwnership(notificationId, user);
        notificationRepository.delete(n);
    }

    private Notification getAndVerifyOwnership(UUID id, User user) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!n.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You do not own this notification");
        }
        return n;
    }

    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getType(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}
