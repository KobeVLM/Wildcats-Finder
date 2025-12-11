package com.wildcatsfinder.wildcats_finder.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * RegisterRequestDTO - Data for user registration
 */
public class RegisterRequestDTO {
    
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "First name is required")
    private String fName;
    
    private String mName;
    
    @NotBlank(message = "Last name is required")
    private String lName;
    
    private String contactNo;
    
    private String studentId;

    // Constructors
    public RegisterRequestDTO() {}

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFName() { return fName; }
    public void setFName(String fName) { this.fName = fName; }

    public String getMName() { return mName; }
    public void setMName(String mName) { this.mName = mName; }

    public String getLName() { return lName; }
    public void setLName(String lName) { this.lName = lName; }

    public String getContactNo() { return contactNo; }
    public void setContactNo(String contactNo) { this.contactNo = contactNo; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
}
