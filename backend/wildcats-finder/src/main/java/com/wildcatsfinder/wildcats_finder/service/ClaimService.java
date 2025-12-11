package com.wildcatsfinder.wildcats_finder.service;

import com.wildcatsfinder.wildcats_finder.entity.ClaimEntity;
import com.wildcatsfinder.wildcats_finder.entity.ItemEntity;
import com.wildcatsfinder.wildcats_finder.entity.UserEntity;
import com.wildcatsfinder.wildcats_finder.repository.ClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepository claimRepository;

    // CREATE: Add a new claim
    public ClaimEntity createClaim(ClaimEntity claim) {
        return claimRepository.save(claim);
    }

    // READ: Fetch all claims
    public List<ClaimEntity> getAllClaims() {
        return claimRepository.findAll();
    }

    // READ: Fetch a claim by its ID
    public ClaimEntity getClaimById(Long id) {
        Optional<ClaimEntity> claim = claimRepository.findById(id);
        if (claim.isPresent()) {
            return claim.get();
        } else {
            throw new NoSuchElementException("Claim " + id + " not found");
        }
    }

    // READ: Fetch claims by item
    public List<ClaimEntity> getClaimsByItem(ItemEntity item) {
        return claimRepository.findByItem_ItemId(item.getItemId());
    }

    // READ: Fetch claims by user
    public List<ClaimEntity> getClaimsByUser(UserEntity user) {
        return claimRepository.findByUser_UserId(user.getUserId());
    }

    // READ: Fetch claims by status
    public List<ClaimEntity> getClaimsByStatus(String status) {
        List<ClaimEntity> claims = claimRepository.findAll();
        List<ClaimEntity> matchingClaims = new ArrayList<>();

        // Loop through each claim and check if status matches
        for (ClaimEntity claim : claims) {
            if (claim.getStatus().equals(status)) {
                matchingClaims.add(claim);
            }
        }

        return matchingClaims;
    }

    // READ: Fetch verified or unverified claims
    public List<ClaimEntity> getClaimsByVerification(Boolean verified) {
        return claimRepository.findByVerified(verified);
    }

    // READ: Fetch claims by user and status
    public List<ClaimEntity> getClaimsByUserAndStatus(UserEntity user, String status) {
        // Combining available methods - get user's claims then filter by status
        List<ClaimEntity> userClaims = claimRepository.findByUser_UserId(user.getUserId());
        List<ClaimEntity> matchingClaims = new ArrayList<>();

        // Loop through user's claims and check if status matches
        for (ClaimEntity claim : userClaims) {
            if (claim.getStatus().equals(status)) {
                matchingClaims.add(claim);
            }
        }

        return matchingClaims;
    }

    // READ: Fetch claims between two dates
    public List<ClaimEntity> getClaimsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        List<ClaimEntity> claims = claimRepository.findAll();
        List<ClaimEntity> matchingClaims = new ArrayList<>();

        // Loop through each claim and check if date is between start and end dates
        for (ClaimEntity claim : claims) {
            if (claim.getClaimDate().isAfter(startDate) && claim.getClaimDate().isBefore(endDate)) {
                matchingClaims.add(claim);
            }
        }

        return matchingClaims;
    }

    // READ: Fetch recent claims (last 7 days)
    public List<ClaimEntity> getRecentClaims() {
        return claimRepository.findAll();
    }

    // READ: Count claims for an item
    public Long countClaimsByItemId(Long itemId) {
        List<ClaimEntity> claims = claimRepository.findByItem_ItemId(itemId);
        return (long) claims.size();
    }

    // UPDATE: Modify an existing claim
    public ClaimEntity updateClaim(Long id, ClaimEntity claimDetails) {
        // Check Optional explicitly and assign to a variable
        ClaimEntity claim;
        Optional<ClaimEntity> optionalClaim = claimRepository.findById(id);
        if (optionalClaim.isPresent()) {
            claim = optionalClaim.get();
        } else {
            throw new NoSuchElementException("Claim " + id + " not found");
        }

        // Update claim fields
        claim.setClaimDate(claimDetails.getClaimDate());
        claim.setStatus(claimDetails.getStatus());
        claim.setVerified(claimDetails.getVerified());
        claim.setItem(claimDetails.getItem());
        claim.setUser(claimDetails.getUser());

        return claimRepository.save(claim);
    }

    // UPDATE: Verify a claim
    public ClaimEntity verifyClaim(Long id, Boolean verified) {
        // Check Optional explicitly and assign to a variable
        ClaimEntity claim;
        Optional<ClaimEntity> optionalClaim = claimRepository.findById(id);
        if (optionalClaim.isPresent()) {
            claim = optionalClaim.get();
        } else {
            throw new NoSuchElementException("Claim " + id + " not found");
        }

        // Update only the verification status
        claim.setVerified(verified);
        return claimRepository.save(claim);
    }

    // UPDATE: Change claim status
    public ClaimEntity updateClaimStatus(Long id, String newStatus) {
        // Check Optional explicitly and assign to a variable
        ClaimEntity claim;
        Optional<ClaimEntity> optionalClaim = claimRepository.findById(id);
        if (optionalClaim.isPresent()) {
            claim = optionalClaim.get();
        } else {
            throw new NoSuchElementException("Claim " + id + " not found");
        }

        // Update only the status
        claim.setStatus(newStatus);
        return claimRepository.save(claim);
    }

    // DELETE: Remove a claim
    public String deleteClaim(Long id) {
        if (claimRepository.findById(id).isPresent()) {
            claimRepository.deleteById(id);
            return "Claim " + id + " is successfully deleted!";
        } else {
            return "Claim " + id + " does not exist.";
        }
    }

    // CLAIMS PAGE: Get claims by user ID for React Claims page
    public List<ClaimEntity> getClaimsByUserId(Long userId) {
        return claimRepository.findByUser_UserId(userId);
    }

    // ITEM DETAILS: Get claims for a specific item
    public List<ClaimEntity> getClaimsByItemId(Long itemId) {
        return claimRepository.findByItem_ItemId(itemId);
    }

    // ADMIN: Get pending claims for admin review
    public List<ClaimEntity> getPendingClaims() {
        return claimRepository.findByVerified(false);
    }

    // ADMIN: Get verified claims
    public List<ClaimEntity> getVerifiedClaims() {
        return claimRepository.findByVerified(true);
    }

    // FILE CLAIM: File a new claim with automatic timestamp
   public ClaimEntity fileNewClaim(ClaimEntity claim) {
    System.out.println("=== DEBUG: fileNewClaim called ===");
    System.out.println("Received claim data:");
    System.out.println("Item ID: " + (claim.getItem() != null ? claim.getItem().getItemId() : "null"));
    System.out.println("User ID: " + (claim.getUser() != null ? claim.getUser().getUserId() : "null"));
    System.out.println("Verification Answer: " + claim.getVerificationAnswer());
    System.out.println("Status: " + claim.getStatus());
    System.out.println("Verified: " + claim.getVerified());
    
    // Set default values
    claim.setClaimDate(LocalDateTime.now());
    claim.setVerified(false); // Set as pending by default
    claim.setStatus("PENDING"); // Set default status
    
    // If verificationAnswer is null, set a default
    if (claim.getVerificationAnswer() == null) {
        System.out.println("WARNING: verificationAnswer is null! Setting default.");
        claim.setVerificationAnswer("No verification provided");
    }
    
    ClaimEntity savedClaim = claimRepository.save(claim);
    System.out.println("Claim saved with ID: " + savedClaim.getClaimId());
    System.out.println("Saved verificationAnswer: " + savedClaim.getVerificationAnswer());
    
    return savedClaim;
}

    // REJECT CLAIM: Reject a pending claim
    public ClaimEntity rejectClaim(Long claimId) {
        ClaimEntity claim;
        Optional<ClaimEntity> optionalClaim = claimRepository.findById(claimId);
        if (optionalClaim.isPresent()) {
            claim = optionalClaim.get();
        } else {
            throw new NoSuchElementException("Claim " + claimId + " not found");
        }

        claim.setVerified(false);
        claim.setStatus("REJECTED");
        return claimRepository.save(claim);
    }

    // ========== ENHANCED CLAIM METHODS WITH NOTIFICATIONS ==========

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private com.wildcatsfinder.wildcats_finder.repository.ItemRepository itemRepository;

    /**
     * Approve a claim with notifications
     */
    public ClaimEntity approveClaim(Long claimId) {
        ClaimEntity claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new NoSuchElementException("Claim " + claimId + " not found"));

        claim.setVerified(true);
        claim.setStatus("APPROVED");

        // Update item status to CLAIMED
        ItemEntity item = claim.getItem();
        item.setStatus(ItemEntity.ItemStatus.CLAIMED);
        itemRepository.save(item);

        ClaimEntity savedClaim = claimRepository.save(claim);

        // Send notification to claimant
        try {
            notificationService.notifyClaimApproved(
                    claim.getUser().getUserId(),
                    item.getItemTitle(),
                    claimId
            );
        } catch (Exception e) {
            System.out.println("Failed to send notification: " + e.getMessage());
        }

        return savedClaim;
    }

    /**
     * Reject a claim with reason and notification
     */
    public ClaimEntity rejectClaimWithReason(Long claimId, String reason) {
        ClaimEntity claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new NoSuchElementException("Claim " + claimId + " not found"));

        claim.setVerified(false);
        claim.setStatus("REJECTED");
        claim.setRejectionReason(reason);
        
        ClaimEntity savedClaim = claimRepository.save(claim);

        // Send notification to claimant
        try {
            notificationService.notifyClaimRejected(
                    claim.getUser().getUserId(),
                    claim.getItem().getItemTitle(),
                    claimId,
                    reason
            );
        } catch (Exception e) {
            System.out.println("Failed to send notification: " + e.getMessage());
        }

        return savedClaim;
    }

    /**
     * Mark item as returned after successful claim
     */
    public ClaimEntity markAsReturned(Long claimId) {
        ClaimEntity claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new NoSuchElementException("Claim " + claimId + " not found"));

        if (!claim.getStatus().equals("APPROVED")) {
            throw new IllegalStateException("Only approved claims can be marked as returned");
        }

        claim.setStatus("RETURNED");

        // Update item status to RETURNED
        ItemEntity item = claim.getItem();
        item.setStatus(ItemEntity.ItemStatus.RETURNED);
        itemRepository.save(item);

        return claimRepository.save(claim);
    }

    /**
     * Notify item owner when a new claim is filed
     */
    public void notifyOwnerOfNewClaim(ClaimEntity claim) {
        try {
            ItemEntity item = claim.getItem();
            UserEntity claimant = claim.getUser();
            
            String claimantName = claimant.getFName() + " " + claimant.getLName();
            
            notificationService.notifyClaimReceived(
                    item.getUser().getUserId(),
                    item.getItemTitle(),
                    claim.getClaimId(),
                    claimantName
            );
        } catch (Exception e) {
            System.out.println("Failed to send notification: " + e.getMessage());
        }
    }
}