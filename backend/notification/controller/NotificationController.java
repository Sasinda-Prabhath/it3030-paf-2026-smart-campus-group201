package notification.controller;

import notification.dto.NotificationDto;
import notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/me")
    public ResponseEntity<List<NotificationDto>> getMyNotifications() {
        List<NotificationDto> notifications = notificationService.getMyNotifications();
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/me/unread-count")
    public ResponseEntity<Integer> getUnreadCount() {
        int count = notificationService.getUnreadCount();
        return ResponseEntity.ok(count);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(@PathVariable Long id) {
        NotificationDto notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }

    @PatchMapping("/me/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}