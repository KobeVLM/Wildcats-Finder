package com.wildcatsfinder.wildcats_finder.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
public class ClaimEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "claim_id")
    private Long claimId;

    @Column(name = "claim_date", nullable = false)
    private LocalDateTime claimDate;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "verified", nullable = false)
    private Boolean verified;

    // NEW FIELDS - Priority 1
    @Column(name = "verification_answer", columnDefinition = "TEXT")
    private String verificationAnswer;

    @Column(name = "contact_info")
    private String contactInfo;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    // Foreign Key Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private ItemEntity item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    // Constructors
    public ClaimEntity() {
    }

    public ClaimEntity(LocalDateTime claimDate, String status, Boolean verified,
            ItemEntity item, UserEntity user) {
        this.claimDate = claimDate;
        this.status = status;
        this.verified = verified;
        this.item = item;
        this.user = user;
    }

    // Getters and Setters
    public Long getClaimId() {
        return claimId;
    }

    public void setClaimId(Long claimId) {
        this.claimId = claimId;
    }

    public LocalDateTime getClaimDate() {
        return claimDate;
    }

    public void setClaimDate(LocalDateTime claimDate) {
        this.claimDate = claimDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public String getVerificationAnswer() {
        return verificationAnswer;
    }

    public void setVerificationAnswer(String verificationAnswer) {
        this.verificationAnswer = verificationAnswer;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public ItemEntity getItem() {
        return item;
    }

    public void setItem(ItemEntity item) {
        this.item = item;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
}