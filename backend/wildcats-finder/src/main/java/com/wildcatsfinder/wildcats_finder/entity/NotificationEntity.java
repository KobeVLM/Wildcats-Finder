package com.wildcatsfinder.wildcats_finder.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * NotificationEntity - Stores notifications for users
 * 
 * Types:
 * - CLAIM_RECEIVED - Someone claimed your item
 * - CLAIM_APPROVED - Your claim was approved
 * - CLAIM_REJECTED - Your claim was rejected
 * - ITEM_APPROVED - Admin approved your item
 * - ITEM_REJECTED - Admin rejected your item
 * - MATCH_FOUND - Potential match found for your item
 */
@Entity
@Table(name = "notifications")
public class NotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    // The user who receives this notification
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    // Type of notification (CLAIM_RECEIVED, CLAIM_APPROVED, etc.)
    @Column(name = "type", nullable = false)
    private String type;

    // Notification title
    @Column(name = "title", nullable = false)
    private String title;

    // Notification message/content
    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    // Has the user read this notification?
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    // Reference to related item or claim ID (optional)
    @Column(name = "reference_id")
    private Long referenceId;

    // What type of reference (ITEM or CLAIM)
    @Column(name = "reference_type")
    private String referenceType;

    // When was this notification created?
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isRead == null) {
            this.isRead = false;
        }
    }

    // Constructors
    public NotificationEntity() {}

    public NotificationEntity(UserEntity user, String type, String title, String message) {
        this.user = user;
        this.type = type;
        this.title = title;
        this.message = message;
        this.isRead = false;
    }

    // Getters and Setters
    public Long getNotificationId() { return notificationId; }
    public void setNotificationId(Long notificationId) { this.notificationId = notificationId; }

    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public Long getReferenceId() { return referenceId; }
    public void setReferenceId(Long referenceId) { this.referenceId = referenceId; }

    public String getReferenceType() { return referenceType; }
    public void setReferenceType(String referenceType) { this.referenceType = referenceType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
