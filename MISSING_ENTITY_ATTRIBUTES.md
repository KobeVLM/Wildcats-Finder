# Missing Backend Entity Attributes - Quick Reference

## 📋 **COMPLETE LIST OF MISSING ATTRIBUTES**

---

## 1️⃣ **ItemEntity** - Missing Attributes

### **Current ItemEntity Has:**
```java
✅ itemId: Long
✅ itemTitle: String
✅ itemDesc: String
✅ dateReport: LocalDateTime
✅ location: String
✅ imageUrl: String
✅ status: ItemStatus (enum)
✅ user: UserEntity (FK)
✅ category: CategoryEntity (FK)
✅ department: DepartmentEntity (FK)
✅ claims: List<ClaimEntity>
```

### **Missing: NOTHING** ✅
**ItemEntity is complete!**

### **But ItemStatus Enum Needs Expansion:**

**Current Enum:**
```java
public enum ItemStatus {
    LOST,      // ✅ Has
    FOUND,     // ✅ Has
    CLAIMED,   // ✅ Has
    RETURNED   // ✅ Has
}
```

**Missing Values:**
```java
❌ PENDING   // For items awaiting admin approval
❌ ACTIVE    // For approved items (alternative to LOST/FOUND)
❌ REJECTED  // For rejected items
```

**Recommended New Enum:**
```java
public enum ItemStatus {
    PENDING,   // ← ADD: Items awaiting approval
    ACTIVE,    // ← ADD: Approved items (optional)
    LOST,      // Keep: For filtering
    FOUND,     // Keep: For filtering
    CLAIMED,   // Keep: Item has been claimed
    RETURNED,  // Keep: Item has been returned
    REJECTED   // ← ADD: Rejected by admin
}
```

---

## 2️⃣ **ClaimEntity** - Missing Attributes

### **Current ClaimEntity Has:**
```java
✅ claimId: Long
✅ claimDate: LocalDateTime
✅ status: String
✅ verified: Boolean
✅ item: ItemEntity (FK)
✅ user: UserEntity (FK)
```

### **Missing Attributes:**
```java
❌ verificationAnswer: String    // User's answer to verification question
❌ contactInfo: String            // User's contact information
❌ rejectionReason: String        // Reason if claim is rejected
❌ reviewedAt: LocalDateTime      // When claim was reviewed
❌ reviewedBy: UserEntity (FK)    // Who reviewed the claim (optional)
```

**Add These Fields:**
```java
@Column(name = "verification_answer", columnDefinition = "TEXT")
private String verificationAnswer;

@Column(name = "contact_info")
private String contactInfo;

@Column(name = "rejection_reason", columnDefinition = "TEXT")
private String rejectionReason;

@Column(name = "reviewed_at")
private LocalDateTime reviewedAt;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "reviewed_by")
private UserEntity reviewedBy;  // Optional: track who approved/rejected
```

---

## 3️⃣ **UserEntity** - Missing Attributes

### **Current UserEntity Has:**
```java
✅ userId: Long
✅ username: String
✅ password: String
✅ fName: String
✅ mName: String
✅ lName: String
✅ email: String
✅ contactNo: String
✅ role: String
✅ reportedItems: List<ItemEntity>
✅ claims: List<ClaimEntity>
```

### **Missing Attributes:**
```java
❌ studentId: String              // Student ID number
❌ suspended: Boolean             // Is user suspended?
❌ suspensionReason: String       // Why user was suspended
❌ suspensionDate: LocalDateTime  // When user was suspended
❌ joinedAt: LocalDateTime        // Account creation date
```

**Add These Fields:**
```java
@Column(name = "student_id", unique = true)
private String studentId;

@Column(name = "suspended", nullable = false)
private Boolean suspended = false;

@Column(name = "suspension_reason", columnDefinition = "TEXT")
private String suspensionReason;

@Column(name = "suspension_date")
private LocalDateTime suspensionDate;

@Column(name = "joined_at", nullable = false)
private LocalDateTime joinedAt;
```

---

## 4️⃣ **NotificationEntity** - COMPLETELY MISSING

### **Needs to be Created:**
```java
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
    private String type;  // "match", "claim", "admin"
    
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "read", nullable = false)
    private Boolean read = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_item_id")
    private ItemEntity relatedItem;  // Optional: link to item
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_claim_id")
    private ClaimEntity relatedClaim;  // Optional: link to claim
    
    // Constructors, Getters, Setters...
}
```

---

## 📊 **SUMMARY TABLE**

| Entity | Total Fields Needed | Currently Has | Missing | Status |
|--------|-------------------|---------------|---------|--------|
| **ItemEntity** | 11 | 11 | 0 | ✅ Complete |
| **ItemStatus Enum** | 7 values | 4 values | 3 values | ⚠️ Needs expansion |
| **ClaimEntity** | 11 | 6 | 5 | ⚠️ Needs 5 fields |
| **UserEntity** | 16 | 11 | 5 | ⚠️ Needs 5 fields |
| **NotificationEntity** | 9 | 0 | 9 | ❌ Needs creation |

---

## 🎯 **PRIORITY BREAKDOWN**

### **Priority 1: Critical (Blocks Core Flow)** 🔴

**ItemStatus Enum:**
```java
❌ PENDING
❌ ACTIVE (optional)
❌ REJECTED
```

**ClaimEntity:**
```java
❌ verificationAnswer: String
❌ contactInfo: String
❌ rejectionReason: String
❌ reviewedAt: LocalDateTime
```

**Impact:** Without these, claim dialog and item approval won't work.

---

### **Priority 2: Important (Blocks Admin Features)** 🟡

**UserEntity:**
```java
❌ studentId: String
❌ suspended: Boolean
❌ suspensionReason: String
❌ suspensionDate: LocalDateTime
❌ joinedAt: LocalDateTime
```

**Impact:** Without these, user management and suspension won't work.

---

### **Priority 3: Nice to Have** 🟢

**NotificationEntity:**
```java
❌ Complete entity needs to be created
```

**Impact:** Without this, notifications feature won't work.

---

## 📝 **EXACT CODE TO ADD**

### **1. Update ItemEntity.java**

**Location:** Line 53 (inside ItemStatus enum)

**Add:**
```java
public enum ItemStatus {
    PENDING,   // ← ADD THIS
    ACTIVE,    // ← ADD THIS (optional)
    LOST,
    FOUND,
    CLAIMED,
    RETURNED,
    REJECTED   // ← ADD THIS
}
```

---

### **2. Update ClaimEntity.java**

**Location:** After line 22 (after `verified` field)

**Add:**
```java
@Column(name = "verification_answer", columnDefinition = "TEXT")
private String verificationAnswer;

@Column(name = "contact_info")
private String contactInfo;

@Column(name = "rejection_reason", columnDefinition = "TEXT")
private String rejectionReason;

@Column(name = "reviewed_at")
private LocalDateTime reviewedAt;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "reviewed_by")
private UserEntity reviewedBy;
```

**Then add getters/setters:**
```java
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

public UserEntity getReviewedBy() {
    return reviewedBy;
}

public void setReviewedBy(UserEntity reviewedBy) {
    this.reviewedBy = reviewedBy;
}
```

---

### **3. Update UserEntity.java**

**Location:** After line 37 (after `role` field)

**Add:**
```java
@Column(name = "student_id", unique = true)
private String studentId;

@Column(name = "suspended", nullable = false)
private Boolean suspended = false;

@Column(name = "suspension_reason", columnDefinition = "TEXT")
private String suspensionReason;

@Column(name = "suspension_date")
private LocalDateTime suspensionDate;

@Column(name = "joined_at", nullable = false)
private LocalDateTime joinedAt;
```

**Then add getters/setters:**
```java
public String getStudentId() {
    return studentId;
}

public void setStudentId(String studentId) {
    this.studentId = studentId;
}

public Boolean getSuspended() {
    return suspended;
}

public void setSuspended(Boolean suspended) {
    this.suspended = suspended;
}

public String getSuspensionReason() {
    return suspensionReason;
}

public void setSuspensionReason(String suspensionReason) {
    this.suspensionReason = suspensionReason;
}

public LocalDateTime getSuspensionDate() {
    return suspensionDate;
}

public void setSuspensionDate(LocalDateTime suspensionDate) {
    this.suspensionDate = suspensionDate;
}

public LocalDateTime getJoinedAt() {
    return joinedAt;
}

public void setJoinedAt(LocalDateTime joinedAt) {
    this.joinedAt = joinedAt;
}
```

---

### **4. Create NotificationEntity.java**

**Location:** Create new file in `entity` folder

**Full Code:** (See section 4 above)

---

## 🗄️ **DATABASE MIGRATION NEEDED**

After adding these fields, you'll need to update your database schema:

### **Option A: Drop and Recreate (Development Only)**
```properties
# application.properties
spring.jpa.hibernate.ddl-auto=create-drop
```
⚠️ **WARNING:** This will delete all data!

### **Option B: Update Schema (Recommended)**
```properties
# application.properties
spring.jpa.hibernate.ddl-auto=update
```
✅ This will add new columns without deleting data.

### **Option C: Manual SQL (Production)**
```sql
-- Add to items table
ALTER TABLE items ADD COLUMN status VARCHAR(20);
-- Update existing records
UPDATE items SET status = 'ACTIVE' WHERE status IN ('LOST', 'FOUND');

-- Add to claims table
ALTER TABLE claims ADD COLUMN verification_answer TEXT;
ALTER TABLE claims ADD COLUMN contact_info VARCHAR(255);
ALTER TABLE claims ADD COLUMN rejection_reason TEXT;
ALTER TABLE claims ADD COLUMN reviewed_at TIMESTAMP;
ALTER TABLE claims ADD COLUMN reviewed_by BIGINT;

-- Add to users table
ALTER TABLE users ADD COLUMN student_id VARCHAR(50) UNIQUE;
ALTER TABLE users ADD COLUMN suspended BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN suspension_reason TEXT;
ALTER TABLE users ADD COLUMN suspension_date TIMESTAMP;
ALTER TABLE users ADD COLUMN joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create notifications table
CREATE TABLE notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    user_id BIGINT NOT NULL REFERENCES users(user_id),
    related_item_id BIGINT REFERENCES items(item_id),
    related_claim_id BIGINT REFERENCES claims(claim_id)
);
```

---

## ✅ **CHECKLIST**

### **Priority 1 (Critical):**
- [ ] Add PENDING, ACTIVE, REJECTED to ItemStatus enum
- [ ] Add verificationAnswer to ClaimEntity
- [ ] Add contactInfo to ClaimEntity
- [ ] Add rejectionReason to ClaimEntity
- [ ] Add reviewedAt to ClaimEntity

### **Priority 2 (Important):**
- [ ] Add studentId to UserEntity
- [ ] Add suspended to UserEntity
- [ ] Add suspensionReason to UserEntity
- [ ] Add suspensionDate to UserEntity
- [ ] Add joinedAt to UserEntity

### **Priority 3 (Nice to Have):**
- [ ] Create NotificationEntity
- [ ] Create NotificationService
- [ ] Create NotificationController

---

## 📊 **IMPACT ANALYSIS**

| Missing Attribute | Blocks Feature | Priority |
|------------------|----------------|----------|
| ItemStatus.PENDING | Admin approval workflow | 🔴 Critical |
| ItemStatus.REJECTED | Admin rejection | 🔴 Critical |
| verificationAnswer | Claim verification | 🔴 Critical |
| contactInfo | Claim contact info | 🔴 Critical |
| rejectionReason | Claim rejection feedback | 🔴 Critical |
| studentId | User management table | 🟡 Important |
| suspended | User suspension | 🟡 Important |
| suspensionReason | Suspension details | 🟡 Important |
| joinedAt | User stats | 🟡 Important |
| NotificationEntity | Notifications | 🟢 Nice to have |

---

## 🎯 **RECOMMENDED ORDER**

1. **First:** Update ItemStatus enum (5 minutes)
2. **Second:** Update ClaimEntity (15 minutes)
3. **Third:** Update UserEntity (15 minutes)
4. **Fourth:** Create NotificationEntity (20 minutes)
5. **Finally:** Run database migration

**Total Time:** ~1 hour for all changes

---

**This gives you the complete list of what's missing and exactly where to add it!** 🚀
