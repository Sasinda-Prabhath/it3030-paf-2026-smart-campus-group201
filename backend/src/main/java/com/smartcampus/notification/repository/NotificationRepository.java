package com.smartcampus.notification.repository;

import com.smartcampus.notification.entity.Notification;
import com.smartcampus.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    int countByUserAndIsReadFalse(User user);
    List<Notification> findByUserAndIsReadFalse(User user);
}