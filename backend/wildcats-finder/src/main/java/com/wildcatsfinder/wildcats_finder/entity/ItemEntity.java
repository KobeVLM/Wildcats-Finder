package com.wildcatsfinder.wildcats_finder.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "items")
public class ItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "item_title", nullable = false)
    private String itemTitle;

    @Column(name = "item_desc")
    private String itemDesc;

    @Column(name = "date_report", nullable = false)
    private LocalDateTime dateReport;

    @Column(name = "location")
    private String location;

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ItemStatus status;

    // Relationships - FIXED FOR JSON SERIALIZATION
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // Prevent circular reference
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnore // Prevent circular reference
    private CategoryEntity category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dep_id", nullable = false)
    @JsonIgnore // Prevent circular reference
    private DepartmentEntity department;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Prevent circular reference
    private List<ClaimEntity> claims;

    // JSON getters for frontend
    @JsonProperty("userId")
    public Long getUserId() {
        return user != null ? user.getUserId() : null;
    }
    
    @JsonProperty("categoryName")
    public String getCategoryName() {
        return category != null ? category.getCategoryName() : null;
    }
    
    @JsonProperty("departmentName")
    public String getDepartmentName() {
        return department != null ? department.getDepName() : null;
    }

    public enum ItemStatus {
        LOST, FOUND, CLAIMED, RETURNED
    }

    // Constructors
    public ItemEntity() {
    }

    public ItemEntity(String itemTitle, String itemDesc, LocalDateTime dateReport,
            String location, String imageUrl, ItemStatus status, UserEntity user,
            CategoryEntity category, DepartmentEntity department) {
        this.itemTitle = itemTitle;
        this.itemDesc = itemDesc;
        this.dateReport = dateReport;
        this.location = location;
        this.imageUrl = imageUrl;
        this.status = status;
        this.user = user;
        this.category = category;
        this.department = department;
    }

    // Getters and Setters
    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getItemTitle() {
        return itemTitle;
    }

    public void setItemTitle(String itemTitle) {
        this.itemTitle = itemTitle;
    }

    public String getItemDesc() {
        return itemDesc;
    }

    public void setItemDesc(String itemDesc) {
        this.itemDesc = itemDesc;
    }

    public LocalDateTime getDateReport() {
        return dateReport;
    }

    public void setDateReport(LocalDateTime dateReport) {
        this.dateReport = dateReport;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public ItemStatus getStatus() {
        return status;
    }

    public void setStatus(ItemStatus status) {
        this.status = status;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public CategoryEntity getCategory() {
        return category;
    }

    public void setCategory(CategoryEntity category) {
        this.category = category;
    }

    public DepartmentEntity getDepartment() {
        return department;
    }

    public void setDepartment(DepartmentEntity department) {
        this.department = department;
    }

    public List<ClaimEntity> getClaims() {
        return claims;
    }

    public void setClaims(List<ClaimEntity> claims) {
        this.claims = claims;
    }
}