package com.wildcatsfinder.wildcats_finder.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * AuthRequestDTO - Data for login requests
 * 
 * Contains only email and password for authentication
 */
public class AuthRequestDTO {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;

    // Constructors
    public AuthRequestDTO() {}

    public AuthRequestDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
