package com.wildcatsfinder.wildcats_finder.dto;

public class ClaimDTO {
    private Long claimId;
    private Long itemId;
    private Long userId;
    private String verificationAnswer;
    private String claimDate;
    private String status;
    private Boolean verified;
    
    // Constructors
    public ClaimDTO() {}
    
    public ClaimDTO(Long itemId, Long userId, String verificationAnswer) {
        this.itemId = itemId;
        this.userId = userId;
        this.verificationAnswer = verificationAnswer;
        this.status = "PENDING";
        this.verified = false;
    }
    
    // Getters and Setters
    public Long getClaimId() { return claimId; }
    public void setClaimId(Long claimId) { this.claimId = claimId; }
    
    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getVerificationAnswer() { return verificationAnswer; }
    public void setVerificationAnswer(String verificationAnswer) { this.verificationAnswer = verificationAnswer; }
    
    public String getClaimDate() { return claimDate; }
    public void setClaimDate(String claimDate) { this.claimDate = claimDate; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }
}