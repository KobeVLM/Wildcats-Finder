package com.wildcatsfinder.wildcats_finder.dto;

/**
 * AuthResponseDTO - Response after successful login
 * 
 * Contains JWT token and user information (no password)
 */
public class AuthResponseDTO {
    
    private String token;
    private String refreshToken;
    private String tokenType = "Bearer";
    private UserDTO user;

    // Constructors
    public AuthResponseDTO() {}

    public AuthResponseDTO(String token, String refreshToken, UserDTO user) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.user = user;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
}
