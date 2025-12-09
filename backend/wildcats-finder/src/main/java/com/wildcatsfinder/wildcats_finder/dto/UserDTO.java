package com.wildcatsfinder.wildcats_finder.dto;

import java.util.List;

public class UserDTO {
    private Long userId;
    private String username;
    private String fName;
    private String mName;
    private String lName;
    private String email;
    private String contactNo;
    private String role;
    private List<ItemDTO> reportedItems;

    public UserDTO() {}

    public UserDTO(Long userId, String username, String fName, String mName, 
                   String lName, String email, String contactNo, String role, 
                   List<ItemDTO> reportedItems) {
        this.userId = userId;
        this.username = username;
        this.fName = fName;
        this.mName = mName;
        this.lName = lName;
        this.email = email;
        this.contactNo = contactNo;
        this.role = role;
        this.reportedItems = reportedItems;
    }

    // Getters and setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFName() { return fName; }
    public void setFName(String fName) { this.fName = fName; }

    public String getMName() { return mName; }
    public void setMName(String mName) { this.mName = mName; }

    public String getLName() { return lName; }
    public void setLName(String lName) { this.lName = lName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContactNo() { return contactNo; }
    public void setContactNo(String contactNo) { this.contactNo = contactNo; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<ItemDTO> getReportedItems() { return reportedItems; }
    public void setReportedItems(List<ItemDTO> reportedItems) { this.reportedItems = reportedItems; }
}

