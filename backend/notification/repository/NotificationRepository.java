package notification.repository;

import notification.entity.Notification;
import user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    int countByUserAndIsReadFalse(User user);
    List<Notification> findByUserAndIsReadFalse(User user);
}