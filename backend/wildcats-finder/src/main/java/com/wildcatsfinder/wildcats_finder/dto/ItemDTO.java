package com.wildcatsfinder.wildcats_finder.dto;

import com.wildcatsfinder.wildcats_finder.entity.ItemEntity;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class ItemDTO {
    private Long itemId;
    private String itemTitle;
    private String itemDesc;
    private String location;
    private String status;
    private String dateReport; // Changed to String for easier JSON serialization
    private String imageUrl;
    private Long userId;
    private Long categoryId;
    private Long departmentId;
    private String categoryName; // Add this for frontend display
    private String depName; // Add this for frontend display

    public ItemDTO() {}

    public ItemDTO(ItemEntity item) {
        this.itemId = item.getItemId();
        this.itemTitle = item.getItemTitle();
        this.itemDesc = item.getItemDesc();
        this.location = item.getLocation();
        this.status = item.getStatus().name();
        this.imageUrl = item.getImageUrl();
        this.userId = item.getUser().getUserId();
        this.categoryId = item.getCategory().getCategoryId();
        this.departmentId = item.getDepartment().getDepId();
        this.imageUrl = item.getImageUrl();
        
        // Convert LocalDate to String for JSON
        if (item.getDateReport() != null) {
            this.dateReport = item.getDateReport().toString(); // Format: "yyyy-MM-dd"
        }
        
        // Add these for frontend display
        this.categoryName = item.getCategory().getCategoryName();
        this.depName = item.getDepartment().getDepName();
    }

    // Getters and setters for all fields
    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getItemTitle() { return itemTitle; }
    public void setItemTitle(String itemTitle) { this.itemTitle = itemTitle; }

    public String getItemDesc() { return itemDesc; }
    public void setItemDesc(String itemDesc) { this.itemDesc = itemDesc; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDateReport() { return dateReport; }
    public void setDateReport(String dateReport) { this.dateReport = dateReport; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getDepName() { return depName; }
    public void setDepName(String depName) { this.depName = depName; }
}