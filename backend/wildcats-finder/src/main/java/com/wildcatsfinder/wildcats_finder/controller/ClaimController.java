package com.wildcatsfinder.wildcats_finder.controller;

import com.wildcatsfinder.wildcats_finder.dto.ClaimDTO;
import com.wildcatsfinder.wildcats_finder.entity.ClaimEntity;
import com.wildcatsfinder.wildcats_finder.entity.ItemEntity;
import com.wildcatsfinder.wildcats_finder.entity.UserEntity;
import com.wildcatsfinder.wildcats_finder.service.ClaimService;
import com.wildcatsfinder.wildcats_finder.service.ItemService;
import com.wildcatsfinder.wildcats_finder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "*")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    @Autowired
    private ItemService itemService;

    @Autowired
    private UserService userService;

    // DTO for the old endpoint (if needed for compatibility)
    public static class ClaimRequest {
        private Long itemId;
        private Long userId;
        private String status;

        public ClaimRequest() {}

        public Long getItemId() { return itemId; }
        public void setItemId(Long itemId) { this.itemId = itemId; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    // CREATE: File a new claim using ClaimDTO (MAIN ENDPOINT)
    @PostMapping
    public ResponseEntity<?> fileClaim(@RequestBody ClaimDTO claimDTO) {
        try {
            // Validate required fields
            if (claimDTO.getItemId() == null) {
                return ResponseEntity.badRequest().body("Item ID is required");
            }
            if (claimDTO.getUserId() == null) {
                return ResponseEntity.badRequest().body("User ID is required");
            }
            if (claimDTO.getVerificationAnswer() == null || claimDTO.getVerificationAnswer().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Verification answer is required");
            }

            // Get related entities
            ItemEntity item = itemService.getItemById(claimDTO.getItemId());
            UserEntity user = userService.getUserById(claimDTO.getUserId());
            
            if (item == null) {
                return ResponseEntity.badRequest().body("Item not found");
            }
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // Create new claim entity from DTO
            ClaimEntity claim = new ClaimEntity();
            claim.setItem(item);
            claim.setUser(user);
            claim.setVerificationAnswer(claimDTO.getVerificationAnswer());
            
            // Set claim date to current time
            claim.setClaimDate(LocalDateTime.now());
            
            // Set status (default to PENDING if not provided)
            claim.setStatus(claimDTO.getStatus() != null ? claimDTO.getStatus() : "PENDING");
            
            // Set verified status (default to false)
            claim.setVerified(claimDTO.getVerified() != null ? claimDTO.getVerified() : false);

            // Save the claim
            ClaimEntity savedClaim = claimService.fileNewClaim(claim);
            
            // Convert to DTO for response
            ClaimDTO responseDTO = convertToDTO(savedClaim);
            
            return ResponseEntity.ok(responseDTO);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error filing claim: " + e.getMessage());
        }
    }

    // READ: Get all claims as DTOs
    @GetMapping
    public ResponseEntity<List<ClaimDTO>> getAllClaims() {
        try {
            List<ClaimEntity> claims = claimService.getAllClaims();
            List<ClaimDTO> claimDTOs = claims.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
            return ResponseEntity.ok(claimDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get claim by ID as DTO
    @GetMapping("/{id}")
    public ResponseEntity<?> getClaimById(@PathVariable Long id) {
        try {
            ClaimEntity claim = claimService.getClaimById(id);
            ClaimDTO claimDTO = convertToDTO(claim);
            return ResponseEntity.ok(claimDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Claim not found: " + e.getMessage());
        }
    }

    // READ: Get claims by user ID as DTOs
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ClaimDTO>> getClaimsByUserId(@PathVariable Long userId) {
        try {
            List<ClaimEntity> claims = claimService.getClaimsByUserId(userId);
            List<ClaimDTO> claimDTOs = claims.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
            return ResponseEntity.ok(claimDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get claims by item ID as DTOs
    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<ClaimDTO>> getClaimsByItemId(@PathVariable Long itemId) {
        try {
            List<ClaimEntity> claims = claimService.getClaimsByItemId(itemId);
            List<ClaimDTO> claimDTOs = claims.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
            return ResponseEntity.ok(claimDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get pending claims as DTOs
    @GetMapping("/pending")
    public ResponseEntity<List<ClaimDTO>> getPendingClaims() {
        try {
            List<ClaimEntity> claims = claimService.getPendingClaims();
            List<ClaimDTO> claimDTOs = claims.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
            return ResponseEntity.ok(claimDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get claims by status as DTOs
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ClaimDTO>> getClaimsByStatus(@PathVariable String status) {
        try {
            List<ClaimEntity> claims = claimService.getClaimsByStatus(status);
            List<ClaimDTO> claimDTOs = claims.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
            return ResponseEntity.ok(claimDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // UPDATE: Approve claim
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveClaim(@PathVariable Long id) {
        try {
            ClaimEntity approvedClaim = claimService.approveClaim(id);
            ClaimDTO claimDTO = convertToDTO(approvedClaim);
            return ResponseEntity.ok(claimDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error approving claim: " + e.getMessage());
        }
    }

    // UPDATE: Reject claim
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectClaim(@PathVariable Long id) {
        try {
            ClaimEntity rejectedClaim = claimService.rejectClaim(id);
            ClaimDTO claimDTO = convertToDTO(rejectedClaim);
            return ResponseEntity.ok(claimDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error rejecting claim: " + e.getMessage());
        }
    }

    // Helper method to convert ClaimEntity to ClaimDTO
    private ClaimDTO convertToDTO(ClaimEntity claim) {
        ClaimDTO dto = new ClaimDTO();
        dto.setClaimId(claim.getClaimId());
        dto.setItemId(claim.getItem().getItemId());
        dto.setUserId(claim.getUser().getUserId());
        dto.setVerificationAnswer(claim.getVerificationAnswer());
        
        // Convert LocalDateTime to String
        if (claim.getClaimDate() != null) {
            dto.setClaimDate(claim.getClaimDate().toString());
        }
        
        dto.setStatus(claim.getStatus());
        dto.setVerified(claim.getVerified());
        
        return dto;
    }

    // Backward compatibility endpoint (if needed)
    @PostMapping("/old")
    public ResponseEntity<?> fileClaimOld(@RequestBody ClaimRequest request) {
        try {
            if (request.getItemId() == null || request.getUserId() == null) {
                return ResponseEntity.badRequest().body("Item ID and User ID are required");
            }

            ItemEntity item = itemService.getItemById(request.getItemId());
            UserEntity user = userService.getUserById(request.getUserId());

            if (item == null || user == null) {
                return ResponseEntity.badRequest().body("Item or User not found");
            }

            ClaimEntity claim = new ClaimEntity();
            claim.setItem(item);
            claim.setUser(user);
            claim.setVerificationAnswer("No verification provided (old endpoint)");
            claim.setClaimDate(LocalDateTime.now());
            claim.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");
            claim.setVerified(false);

            ClaimEntity savedClaim = claimService.fileNewClaim(claim);
            ClaimDTO responseDTO = convertToDTO(savedClaim);
            
            return ResponseEntity.ok(responseDTO);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error filing claim: " + e.getMessage());
        }
    }
}