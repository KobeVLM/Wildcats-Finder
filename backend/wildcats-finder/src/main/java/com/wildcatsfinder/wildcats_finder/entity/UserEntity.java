package com.wildcatsfinder.wildcats_finder.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "f_name", nullable = false)
    private String fName;

    @Column(name = "m_name")
    private String mName;

    @Column(name = "l_name", nullable = false)
    private String lName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "contact_no")
    private String contactNo;

    @Column(name = "role", nullable = false)
    private String role;

    // NEW FIELDS - Priority 2
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

    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ItemEntity> reportedItems;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ClaimEntity> claims;

    // Constructors
    public UserEntity() {
    }

    public UserEntity(String username, String password, String fName, String mName,
            String lName, String email, String contactNo, String role) {
        this.username = username;
        this.password = password;
        this.fName = fName;
        this.mName = mName;
        this.lName = lName;
        this.email = email;
        this.contactNo = contactNo;
        this.role = role;
        this.joinedAt = LocalDateTime.now(); // Auto-set join date
        this.suspended = false; // Default not suspended
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFName() {
        return fName;
    }

    public void setFName(String fName) {
        this.fName = fName;
    }

    public String getMName() {
        return mName;
    }

    public void setMName(String mName) {
        this.mName = mName;
    }

    public String getLName() {
        return lName;
    }

    public void setLName(String lName) {
        this.lName = lName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

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

    public List<ItemEntity> getReportedItems() {
        return reportedItems;
    }

    public void setReportedItems(List<ItemEntity> reportedItems) {
        this.reportedItems = reportedItems;
    }

    public List<ClaimEntity> getClaims() {
        return claims;
    }

    public void setClaims(List<ClaimEntity> claims) {
        this.claims = claims;
    }
}