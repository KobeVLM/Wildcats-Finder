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
        claim.setClaimDate(LocalDateTime.now());
        claim.setVerified(false); // Set as pending by default
        claim.setStatus("PENDING"); // Set default status
        return claimRepository.save(claim);
    }

    // APPROVE CLAIM: Approve a pending claim
    public ClaimEntity approveClaim(Long claimId) {
        ClaimEntity claim;
        Optional<ClaimEntity> optionalClaim = claimRepository.findById(claimId);
        if (optionalClaim.isPresent()) {
            claim = optionalClaim.get();
        } else {
            throw new NoSuchElementException("Claim " + claimId + " not found");
        }

        claim.setVerified(true);
        claim.setStatus("APPROVED");
        return claimRepository.save(claim);
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
}