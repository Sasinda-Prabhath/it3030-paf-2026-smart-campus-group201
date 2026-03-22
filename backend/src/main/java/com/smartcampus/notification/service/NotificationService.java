package com.smartcampus.notification.service;

import com.smartcampus.notification.dto.NotificationDto;
import com.smartcampus.notification.entity.Notification;
import com.smartcampus.notification.repository.NotificationRepository;
import com.smartcampus.common.security.CurrentUserService;
import com.smartcampus.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CurrentUserService currentUserService;

    public List<NotificationDto> getMyNotifications() {
        String email = currentUserService.getCurrentUserEmail();
        var user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    public int getUnreadCount() {
        String email = currentUserService.getCurrentUserEmail();
        var user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    public NotificationDto markAsRead(@NonNull Long id) {
        String email = currentUserService.getCurrentUserEmail();
        var user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findById(id)
            .filter(n -> n.getUser().equals(user))
            .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);
        notification = notificationRepository.save(notification);
        return mapToDto(notification);
    }

    public void markAllAsRead() {
        String email = currentUserService.getCurrentUserEmail();
        var user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        List<Notification> unread = notificationRepository.findByUserAndIsReadFalse(user);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    public void deleteNotification(@NonNull Long id) {
        String email = currentUserService.getCurrentUserEmail();
        var user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        @SuppressWarnings("null")
        Notification notification = notificationRepository.findById(id)
            .filter(n -> n.getUser().equals(user))
            .orElseThrow(() -> new RuntimeException("Notification not found"));

        notificationRepository.delete(notification);
    }

    private NotificationDto mapToDto(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType().name());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt().toString());
        return dto;
    }
}