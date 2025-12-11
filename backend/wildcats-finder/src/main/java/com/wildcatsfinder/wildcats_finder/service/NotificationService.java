package com.wildcatsfinder.wildcats_finder.service;

import com.wildcatsfinder.wildcats_finder.dto.NotificationDTO;
import com.wildcatsfinder.wildcats_finder.entity.NotificationEntity;
import com.wildcatsfinder.wildcats_finder.entity.UserEntity;
import com.wildcatsfinder.wildcats_finder.repository.NotificationRepository;
import com.wildcatsfinder.wildcats_finder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * NotificationService - Business logic for notifications
 * 
 * Handles:
 * - Creating notifications for various events
 * - Retrieving user notifications
 * - Marking notifications as read
 */
@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a notification for a user
     */
    public NotificationDTO createNotification(Long userId, String type, String title, 
                                               String message, Long referenceId, String referenceType) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        NotificationEntity notification = new NotificationEntity(user, type, title, message);
        notification.setReferenceId(referenceId);
        notification.setReferenceType(referenceType);

        NotificationEntity saved = notificationRepository.save(notification);
        return convertToDTO(saved);
    }

    /**
     * Create notification when someone claims your item
     */
    public void notifyClaimReceived(Long itemOwnerId, String itemTitle, Long claimId, String claimantName) {
        createNotification(
                itemOwnerId,
                "CLAIM_RECEIVED",
                "New Claim on Your Item",
                claimantName + " has claimed your item: " + itemTitle,
                claimId,
                "CLAIM"
        );
    }

    /**
     * Create notification when your claim is approved
     */
    public void notifyClaimApproved(Long claimantId, String itemTitle, Long claimId) {
        createNotification(
                claimantId,
                "CLAIM_APPROVED",
                "Claim Approved!",
                "Your claim for \"" + itemTitle + "\" has been approved. Contact the owner for pickup.",
                claimId,
                "CLAIM"
        );
    }

    /**
     * Create notification when your claim is rejected
     */
    public void notifyClaimRejected(Long claimantId, String itemTitle, Long claimId, String reason) {
        createNotification(
                claimantId,
                "CLAIM_REJECTED",
                "Claim Rejected",
                "Your claim for \"" + itemTitle + "\" was rejected. Reason: " + reason,
                claimId,
                "CLAIM"
        );
    }

    /**
     * Create notification when admin approves your item
     */
    public void notifyItemApproved(Long userId, String itemTitle, Long itemId) {
        createNotification(
                userId,
                "ITEM_APPROVED",
                "Item Approved!",
                "Your item \"" + itemTitle + "\" has been approved and is now visible to everyone.",
                itemId,
                "ITEM"
        );
    }

    /**
     * Create notification when admin rejects your item
     */
    public void notifyItemRejected(Long userId, String itemTitle, Long itemId, String reason) {
        createNotification(
                userId,
                "ITEM_REJECTED",
                "Item Rejected",
                "Your item \"" + itemTitle + "\" was rejected. Reason: " + reason,
                itemId,
                "ITEM"
        );
    }

    /**
     * Get all notifications for a user
     */
    public List<NotificationDTO> getUserNotifications(Long userId) {
        List<NotificationEntity> notifications = notificationRepository
                .findByUserUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get unread notifications for a user
     */
    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        List<NotificationEntity> notifications = notificationRepository
                .findByUserUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get count of unread notifications
     */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserUserIdAndIsReadFalse(userId);
    }

    /**
     * Mark a notification as read
     */
    public NotificationDTO markAsRead(Long notificationId) {
        NotificationEntity notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        NotificationEntity saved = notificationRepository.save(notification);
        return convertToDTO(saved);
    }

    /**
     * Mark all notifications as read for a user
     */
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadForUser(userId);
    }

    /**
     * Delete a notification
     */
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    /**
     * Convert entity to DTO
     */
    private NotificationDTO convertToDTO(NotificationEntity entity) {
        return new NotificationDTO(
                entity.getNotificationId(),
                entity.getUser().getUserId(),
                entity.getType(),
                entity.getTitle(),
                entity.getMessage(),
                entity.getIsRead(),
                entity.getReferenceId(),
                entity.getReferenceType(),
                entity.getCreatedAt()
        );
    }
}
