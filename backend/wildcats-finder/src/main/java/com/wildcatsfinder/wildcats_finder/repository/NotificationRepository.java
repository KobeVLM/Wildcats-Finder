package com.wildcatsfinder.wildcats_finder.repository;

import com.wildcatsfinder.wildcats_finder.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * NotificationRepository - Database operations for notifications
 */
@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {

    // Find all notifications for a user, ordered by newest first
    List<NotificationEntity> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    // Find unread notifications for a user
    List<NotificationEntity> findByUserUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);

    // Count unread notifications for a user
    long countByUserUserIdAndIsReadFalse(Long userId);

    // Mark all notifications as read for a user
    @Modifying
    @Query("UPDATE NotificationEntity n SET n.isRead = true WHERE n.user.userId = :userId")
    void markAllAsReadForUser(@Param("userId") Long userId);

    // Delete all notifications for a user
    void deleteByUserUserId(Long userId);
}
