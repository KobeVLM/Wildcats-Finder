# Backend Controller Code Snippets - Ready to Copy-Paste

## 1. ItemController - Add These 3 Methods Before the Closing Brace `}`

```java
    // ADMIN: Get pending items (items awaiting approval)
    // GET /api/items/pending
    @GetMapping("/pending")
    public ResponseEntity<List<ItemEntity>> getPendingItems() {
        try {
            List<ItemEntity> items = itemService.getItemsByStatus(ItemStatus.PENDING);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // ADMIN: Approve item (change status from PENDING to ACTIVE)
    // PUT /api/items/{id}/approve
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveItem(@PathVariable Long id) {
        try {
            ItemEntity item = itemService.updateItemStatus(id, ItemStatus.ACTIVE);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error approving item: " + e.getMessage());
        }
    }

    // ADMIN: Reject item (change status to REJECTED)
    // PUT /api/items/{id}/reject
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectItem(@PathVariable Long id) {
        try {
            ItemEntity item = itemService.updateItemStatus(id, ItemStatus.REJECTED);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error rejecting item: " + e.getMessage());
        }
    }
```

**Location:** Add these after the `deleteItem()` method, before the final `}`

---

## 2. ClaimController - Updates Needed

### Step 1: Add NotificationService Autowiring (after line 27)

```java
    @Autowired
    private NotificationService notificationService;
```

### Step 2: Update ClaimRequest DTO (add after line 34)

```java
        private String verificationAnswer;
        private String contactInfo;

        // Getters and Setters
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
```

### Step 3: Update fileClaim() Method (around line 68-96)

Replace the existing `fileClaim()` method with:

```java
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
            claim.setVerificationAnswer(request.getVerificationAnswer()); // NEW
            claim.setContactInfo(request.getContactInfo()); // NEW

            // File the claim with auto-timestamp and pending status
            ClaimEntity savedClaim = claimService.fileNewClaim(claim);
            
            // Create notification for item owner
            notificationService.createClaimNotification(
                item.getUser(), 
                savedClaim, 
                user.getFName() + " " + user.getLName()
            );
            
            return ResponseEntity.ok(savedClaim);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error filing claim: " + e.getMessage());
        }
    }
```

### Step 4: Update approveClaim() Method (around line 198-207)

Replace the existing `approveClaim()` method with:

```java
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveClaim(@PathVariable Long id) {
        try {
            ClaimEntity claim = claimService.getClaimById(id);
            ClaimEntity approvedClaim = claimService.approveClaim(id);
            
            // Create notification for claimant
            notificationService.createClaimApprovedNotification(
                claim.getUser(),
                approvedClaim
            );
            
            return ResponseEntity.ok(approvedClaim);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error approving claim: " + e.getMessage());
        }
    }
```

### Step 5: Update rejectClaim() Method (around line 211-220)

Replace the existing `rejectClaim()` method with:

```java
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectClaim(@PathVariable Long id, @RequestBody String reason) {
        try {
            ClaimEntity claim = claimService.getClaimById(id);
            claim.setRejectionReason(reason);
            claim.setReviewedAt(LocalDateTime.now());
            ClaimEntity rejectedClaim = claimService.rejectClaim(id);
            
            // Create notification for claimant
            notificationService.createClaimRejectedNotification(
                claim.getUser(),
                rejectedClaim
            );
            
            return ResponseEntity.ok(rejectedClaim);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error rejecting claim: " + e.getMessage());
        }
    }
```

### Step 6: Add Import Statement (at top of file)

```java
import com.wildcatsfinder.wildcats_finder.service.NotificationService;
import java.time.LocalDateTime;
```

---

## 3. UserController - Add These 2 Methods Before the Closing Brace `}`

```java
    // ADMIN: Suspend user
    // PUT /api/users/{id}/suspend
    @PutMapping("/{id}/suspend")
    public ResponseEntity<?> suspendUser(@PathVariable Long id, @RequestBody String reason) {
        try {
            UserEntity user = userService.getUserById(id);
            user.setSuspended(true);
            user.setSuspensionReason(reason);
            user.setSuspensionDate(LocalDateTime.now());
            
            UserEntity updatedUser = userService.updateUser(id, user);
            updatedUser.setPassword(null); // Don't return password
            
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error suspending user: " + e.getMessage());
        }
    }

    // ADMIN: Unsuspend user
    // PUT /api/users/{id}/unsuspend
    @PutMapping("/{id}/unsuspend")
    public ResponseEntity<?> unsuspendUser(@PathVariable Long id) {
        try {
            UserEntity user = userService.getUserById(id);
            user.setSuspended(false);
            user.setSuspensionReason(null);
            user.setSuspensionDate(null);
            
            UserEntity updatedUser = userService.updateUser(id, user);
            updatedUser.setPassword(null); // Don't return password
            
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error unsuspending user: " + e.getMessage());
        }
    }
```

**Location:** Add these after the `checkEmailExists()` method, before the final `}`

---

## Quick Reference

### Files to Edit:
1. ✅ `ItemController.java` - Add 3 methods
2. ✅ `ClaimController.java` - Update 5 sections
3. ✅ `UserController.java` - Add 2 methods

### Total Time: ~10 minutes of copy-paste

---

## After Making Changes

Run this command to update the database schema:

```bash
# Make sure spring.jpa.hibernate.ddl-auto=update in application.properties
```

Then restart your Spring Boot application!
