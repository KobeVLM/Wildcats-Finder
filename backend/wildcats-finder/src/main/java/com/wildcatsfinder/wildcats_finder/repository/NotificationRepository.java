package com.wildcatsfinder.wildcats_finder.repository;

import com.wildcatsfinder.wildcats_finder.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    
    // Find notifications by user ID
    List<NotificationEntity> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
    
    // Find unread notifications by user ID
    List<NotificationEntity> findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
    
    // Count unread notifications for a user
    Long countByUser_UserIdAndIsReadFalse(Long userId);
}
