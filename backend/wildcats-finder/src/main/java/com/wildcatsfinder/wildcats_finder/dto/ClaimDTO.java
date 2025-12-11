package com.wildcatsfinder.wildcats_finder.dto;

public class ClaimDTO {
    private Long claimId;
    private Long itemId;
    private Long userId;
    private String verificationAnswer;
    private String claimDate;
    private String status;
    private Boolean verified;
    private String rejectionReason;
    
    // Item details for display
    private String itemTitle;
    private String itemDesc;
    private String itemLocation;
    private String itemImageUrl;
    private String itemStatus;
    
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

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    
    // Item detail getters/setters
    public String getItemTitle() { return itemTitle; }
    public void setItemTitle(String itemTitle) { this.itemTitle = itemTitle; }
    
    public String getItemDesc() { return itemDesc; }
    public void setItemDesc(String itemDesc) { this.itemDesc = itemDesc; }
    
    public String getItemLocation() { return itemLocation; }
    public void setItemLocation(String itemLocation) { this.itemLocation = itemLocation; }
    
    public String getItemImageUrl() { return itemImageUrl; }
    public void setItemImageUrl(String itemImageUrl) { this.itemImageUrl = itemImageUrl; }
    
    public String getItemStatus() { return itemStatus; }
    public void setItemStatus(String itemStatus) { this.itemStatus = itemStatus; }
    
    // Claimant details for "Claims on My Items" display
    private String claimantName;
    private String claimantEmail;
    
    public String getClaimantName() { return claimantName; }
    public void setClaimantName(String claimantName) { this.claimantName = claimantName; }
    
    public String getClaimantEmail() { return claimantEmail; }
    public void setClaimantEmail(String claimantEmail) { this.claimantEmail = claimantEmail; }
}