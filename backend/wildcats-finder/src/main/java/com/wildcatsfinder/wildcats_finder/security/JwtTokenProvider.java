package com.wildcatsfinder.wildcats_finder.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * JwtTokenProvider - Handles JWT token creation and validation
 * 
 * This class is responsible for:
 * 1. Generating JWT tokens when users log in
 * 2. Validating tokens on each request
 * 3. Extracting user information from tokens
 */
@Component
public class JwtTokenProvider {

    // Secret key for signing tokens - should be at least 256 bits for HS256
    // In production, store this in application.properties or environment variable
    @Value("${jwt.secret:wildcatsfinder-super-secret-key-that-is-at-least-256-bits-long}")
    private String jwtSecret;

    // Token validity duration in milliseconds (24 hours)
    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;

    // Refresh token validity (7 days)
    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshExpiration;

    /**
     * Get the signing key from the secret string
     */
    private SecretKey getSigningKey() {
        // Ensure the secret is at least 256 bits (32 characters)
        String paddedSecret = jwtSecret;
        while (paddedSecret.length() < 32) {
            paddedSecret += jwtSecret;
        }
        return Keys.hmacShaKeyFor(paddedSecret.getBytes());
    }

    /**
     * Generate a JWT token for a user
     * 
     * @param email - User's email (used as the subject)
     * @param role - User's role (USER or ADMIN)
     * @return JWT token string
     */
    public String generateToken(String email, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .subject(email)                          // Who the token is for
                .claim("role", role)                     // Custom claim for role
                .issuedAt(now)                           // When token was created
                .expiration(expiryDate)                  // When token expires
                .signWith(getSigningKey())               // Sign with secret key
                .compact();                               // Build the token
    }

    /**
     * Generate a refresh token (longer validity)
     */
    public String generateRefreshToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshExpiration);

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extract email (subject) from token
     * 
     * @param token - JWT token
     * @return email string
     */
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    /**
     * Extract role from token
     */
    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.get("role", String.class);
    }

    /**
     * Validate a JWT token
     * 
     * @param token - JWT token to validate
     * @return true if valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (MalformedJwtException ex) {
            System.out.println("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            System.out.println("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            System.out.println("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            System.out.println("JWT claims string is empty");
        }
        return false;
    }
}
