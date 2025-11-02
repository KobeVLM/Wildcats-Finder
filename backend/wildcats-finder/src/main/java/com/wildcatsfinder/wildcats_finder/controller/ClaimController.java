package com.wildcatsfinder.wildcats_finder.controller;

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

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "*") // For React frontend
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    @Autowired
    private ItemService itemService;

    @Autowired
    private UserService userService;

    // DTO for claim submission
    public static class ClaimRequest {
        private Long itemId;
        private Long userId;
        private String status;

        // Constructors
        public ClaimRequest() {
        }

        // Getters and Setters
        public Long getItemId() {
            return itemId;
        }

        public void setItemId(Long itemId) {
            this.itemId = itemId;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    // CREATE: File a new claim
    // POST /api/claims
    @PostMapping
    public ResponseEntity<?> fileClaim(@RequestBody ClaimRequest request) {
        try {
            // Validate required fields
            if (request.getItemId() == null) {
                return ResponseEntity.badRequest().body("Item ID is required");
            }
            if (request.getUserId() == null) {
                return ResponseEntity.badRequest().body("User ID is required");
            }

            // Get related entities
            ItemEntity item = itemService.getItemById(request.getItemId());
            UserEntity user = userService.getUserById(request.getUserId());

            // Create new claim entity
            ClaimEntity claim = new ClaimEntity();
            claim.setItem(item);
            claim.setUser(user);
            claim.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");

            // File the claim with auto-timestamp and pending status
            ClaimEntity savedClaim = claimService.fileNewClaim(claim);
            return ResponseEntity.ok(savedClaim);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error filing claim: " + e.getMessage());
        }
    }

    // READ: Get all claims (admin functionality)
    // GET /api/claims
    @GetMapping
    public ResponseEntity<List<ClaimEntity>> getAllClaims() {
        try {
            List<ClaimEntity> claims = claimService.getAllClaims();
            return ResponseEntity.ok(claims);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get claim by ID
    // GET /api/claims/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getClaimById(@PathVariable Long id) {
        try {
            ClaimEntity claim = claimService.getClaimById(id);
            return ResponseEntity.ok(claim);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Claim not found: " + e.getMessage());
        }
    }

    // READ: Get claims by user ID (for user's claims page)
    // GET /api/claims/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ClaimEntity>> getClaimsByUserId(@PathVariable Long userId) {
        try {
            List<ClaimEntity> claims = claimService.getClaimsByUserId(userId);
            return ResponseEntity.ok(claims);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get claims by item ID (for item details page)
    // GET /api/claims/item/{itemId}
    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<ClaimEntity>> getClaimsByItemId(@PathVariable Long itemId) {
        try {
            List<ClaimEntity> claims = claimService.getClaimsByItemId(itemId);
            return ResponseEntity.ok(claims);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get pending claims (admin functionality)
    // GET /api/claims/pending
    @GetMapping("/pending")
    public ResponseEntity<List<ClaimEntity>> getPendingClaims() {
        try {
            List<ClaimEntity> claims = claimService.getPendingClaims();
            return ResponseEntity.ok(claims);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get verified claims (admin functionality)
    // GET /api/claims/verified
    @GetMapping("/verified")
    public ResponseEntity<List<ClaimEntity>> getVerifiedClaims() {
        try {
            List<ClaimEntity> claims = claimService.getVerifiedClaims();
            return ResponseEntity.ok(claims);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get claims by status
    // GET /api/claims/status/{status}
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ClaimEntity>> getClaimsByStatus(@PathVariable String status) {
        try {
            List<ClaimEntity> claims = claimService.getClaimsByStatus(status);
            return ResponseEntity.ok(claims);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Count claims for an item
    // GET /api/claims/count/item/{itemId}
    @GetMapping("/count/item/{itemId}")
    public ResponseEntity<Long> countClaimsByItemId(@PathVariable Long itemId) {
        try {
            Long count = claimService.countClaimsByItemId(itemId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0L);
        }
    }

    // UPDATE: Approve claim (admin functionality)
    // PUT /api/claims/{id}/approve
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveClaim(@PathVariable Long id) {
        try {
            ClaimEntity approvedClaim = claimService.approveClaim(id);
            return ResponseEntity.ok(approvedClaim);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error approving claim: " + e.getMessage());
        }
    }

    // UPDATE: Reject claim (admin functionality)
    // PUT /api/claims/{id}/reject
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectClaim(@PathVariable Long id) {
        try {
            ClaimEntity rejectedClaim = claimService.rejectClaim(id);
            return ResponseEntity.ok(rejectedClaim);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error rejecting claim: " + e.getMessage());
        }
    }

    // UPDATE: Update claim status
    // PUT /api/claims/{id}/status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateClaimStatus(@PathVariable Long id, @RequestBody String newStatus) {
        try {
            ClaimEntity updatedClaim = claimService.updateClaimStatus(id, newStatus);
            return ResponseEntity.ok(updatedClaim);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error updating claim status: " + e.getMessage());
        }
    }

    // UPDATE: Verify/unverify claim (admin functionality)
    // PUT /api/claims/{id}/verify
    @PutMapping("/{id}/verify")
    public ResponseEntity<?> verifyClaim(@PathVariable Long id, @RequestBody Boolean verified) {
        try {
            ClaimEntity verifiedClaim = claimService.verifyClaim(id, verified);
            return ResponseEntity.ok(verifiedClaim);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error verifying claim: " + e.getMessage());
        }
    }

    // UPDATE: Update entire claim
    // PUT /api/claims/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateClaim(@PathVariable Long id, @RequestBody ClaimRequest request) {
        try {
            // Get existing claim
            ClaimEntity existingClaim = claimService.getClaimById(id);

            // Get related entities if provided
            if (request.getItemId() != null) {
                ItemEntity item = itemService.getItemById(request.getItemId());
                existingClaim.setItem(item);
            }
            if (request.getUserId() != null) {
                UserEntity user = userService.getUserById(request.getUserId());
                existingClaim.setUser(user);
            }
            if (request.getStatus() != null) {
                existingClaim.setStatus(request.getStatus());
            }

            // Save updated claim
            ClaimEntity updatedClaim = claimService.updateClaim(id, existingClaim);
            return ResponseEntity.ok(updatedClaim);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error updating claim: " + e.getMessage());
        }
    }

    // DELETE: Delete claim
    // DELETE /api/claims/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClaim(@PathVariable Long id) {
        try {
            String result = claimService.deleteClaim(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error deleting claim: " + e.getMessage());
        }
    }
}