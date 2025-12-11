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

    // ADD THIS FIELD - verification answer from user
    @Column(name = "verification_answer", columnDefinition = "TEXT")
    private String verificationAnswer;

    // Foreign Key Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private ItemEntity item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    // Constructors
    public ClaimEntity() {
        this.verified = false; // Default to false
    }

    public ClaimEntity(LocalDateTime claimDate, String status, Boolean verified,
            String verificationAnswer, ItemEntity item, UserEntity user) {
        this.claimDate = claimDate;
        this.status = status;
        this.verified = verified;
        this.verificationAnswer = verificationAnswer;
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

    // ADD THIS GETTER AND SETTER
    public String getVerificationAnswer() {
        return verificationAnswer;
    }

    public void setVerificationAnswer(String verificationAnswer) {
        this.verificationAnswer = verificationAnswer;
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