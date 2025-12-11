package com.wildcatsfinder.wildcats_finder.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

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
    @JsonProperty("fName")
    private String fName;

    @Column(name = "m_name")
    @JsonProperty("mName")
    private String mName;

    @Column(name = "l_name", nullable = false)
    @JsonProperty("lName")
    private String lName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "contact_no")
    private String contactNo;

    @Column(name = "role", nullable = false)
    private String role;

    // NEW FIELDS for security and user management
    @Column(name = "student_id")
    private String studentId;

    @Column(name = "suspended")
    private Boolean suspended = false;

    @Column(name = "suspend_reason")
    private String suspendReason;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.suspended == null) {
            this.suspended = false;
        }
    }

    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ItemEntity> reportedItems;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ClaimEntity> claims;

    // Constructors - Make sure default constructor doesn't set role
    public UserEntity() {
        // Don't set role here - let it be set by Controller
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
    }

    // Getters and Setters (keep as is)
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

    // NEW GETTERS AND SETTERS
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

    public String getSuspendReason() {
        return suspendReason;
    }

    public void setSuspendReason(String suspendReason) {
        this.suspendReason = suspendReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}