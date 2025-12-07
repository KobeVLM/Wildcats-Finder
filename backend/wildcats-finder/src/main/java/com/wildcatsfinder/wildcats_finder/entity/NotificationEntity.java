package com.wildcatsfinder.wildcats_finder.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class NotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    @Column(name = "type", nullable = false)
    private String type; // "claim_submitted", "claim_approved", "claim_rejected"

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    // Foreign Key Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_claim_id")
    private ClaimEntity relatedClaim;

    // Constructors
    public NotificationEntity() {
    }

    public NotificationEntity(String type, String message, UserEntity user, ClaimEntity relatedClaim) {
        this.type = type;
        this.message = message;
        this.user = user;
        this.relatedClaim = relatedClaim;
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
    }

    // Getters and Setters
    public Long getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Long notificationId) {
        this.notificationId = notificationId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public ClaimEntity getRelatedClaim() {
        return relatedClaim;
    }

    public void setRelatedClaim(ClaimEntity relatedClaim) {
        this.relatedClaim = relatedClaim;
    }
}
