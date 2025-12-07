package com.wildcatsfinder.wildcats_finder.service;

import com.wildcatsfinder.wildcats_finder.entity.NotificationEntity;
import com.wildcatsfinder.wildcats_finder.entity.UserEntity;
import com.wildcatsfinder.wildcats_finder.entity.ClaimEntity;
import com.wildcatsfinder.wildcats_finder.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // CREATE: Create a new notification
    public NotificationEntity createNotification(NotificationEntity notification) {
        notification.setCreatedAt(LocalDateTime.now());
        notification.setIsRead(false);
        return notificationRepository.save(notification);
    }

    // Helper: Create notification when someone claims an item
    public NotificationEntity createClaimNotification(UserEntity itemOwner, ClaimEntity claim, String claimantName) {
        String message = claimantName + " has claimed your item: " + claim.getItem().getItemTitle();
        NotificationEntity notification = new NotificationEntity(
            "claim_submitted",
            message,
            itemOwner,
            claim
        );
        return createNotification(notification);
    }

    // Helper: Create notification when claim is approved
    public NotificationEntity createClaimApprovedNotification(UserEntity claimant, ClaimEntity claim) {
        String message = "Your claim for \"" + claim.getItem().getItemTitle() + "\" has been approved!";
        NotificationEntity notification = new NotificationEntity(
            "claim_approved",
            message,
            claimant,
            claim
        );
        return createNotification(notification);
    }

    // Helper: Create notification when claim is rejected
    public NotificationEntity createClaimRejectedNotification(UserEntity claimant, ClaimEntity claim) {
        String message = "Your claim for \"" + claim.getItem().getItemTitle() + "\" has been rejected.";
        if (claim.getRejectionReason() != null) {
            message += " Reason: " + claim.getRejectionReason();
        }
        NotificationEntity notification = new NotificationEntity(
            "claim_rejected",
            message,
            claimant,
            claim
        );
        return createNotification(notification);
    }

    // READ: Get all notifications for a user
    public List<NotificationEntity> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
    }

    // READ: Get unread notifications for a user
    public List<NotificationEntity> getUnreadNotificationsByUserId(Long userId) {
        return notificationRepository.findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    // READ: Count unread notifications for a user
    public Long countUnreadNotifications(Long userId) {
        return notificationRepository.countByUser_UserIdAndIsReadFalse(userId);
    }

    // READ: Get notification by ID
    public NotificationEntity getNotificationById(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
    }

    // UPDATE: Mark notification as read
    public NotificationEntity markAsRead(Long id) {
        NotificationEntity notification = getNotificationById(id);
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    // UPDATE: Mark all notifications as read for a user
    public void markAllAsRead(Long userId) {
        List<NotificationEntity> unreadNotifications = getUnreadNotificationsByUserId(userId);
        for (NotificationEntity notification : unreadNotifications) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }

    // DELETE: Delete notification
    public String deleteNotification(Long id) {
        notificationRepository.deleteById(id);
        return "Notification deleted successfully";
    }

    // DELETE: Delete all notifications for a user
    public String deleteAllNotifications(Long userId) {
        List<NotificationEntity> notifications = getNotificationsByUserId(userId);
        notificationRepository.deleteAll(notifications);
        return "All notifications deleted successfully";
    }
}
