package com.wildcatsfinder.wildcats_finder.controller;

import com.wildcatsfinder.wildcats_finder.dto.*;
import com.wildcatsfinder.wildcats_finder.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AuthController - Handles all authentication endpoints
 * 
 * Endpoints:
 * - POST /api/auth/register - Register new user
 * - POST /api/auth/login - Login user
 * - POST /api/auth/refresh - Refresh JWT token
 * 
 * All endpoints in this controller are PUBLIC (no authentication required)
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/register
     * Register a new user account
     * 
     * Request body: RegisterRequestDTO
     * Response: AuthResponseDTO (with JWT token)
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO request) {
        try {
            AuthResponseDTO response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    /**
     * POST /api/auth/login
     * Authenticate user and return JWT token
     * 
     * Request body: AuthRequestDTO (email, password)
     * Response: AuthResponseDTO (with JWT token)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequestDTO request) {
        try {
            AuthResponseDTO response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    /**
     * POST /api/auth/refresh
     * Get a new JWT token using refresh token
     * 
     * Request body: { "refreshToken": "..." }
     * Response: AuthResponseDTO (with new JWT token)
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");
            if (refreshToken == null || refreshToken.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Refresh token is required"));
            }
            
            AuthResponseDTO response = authService.refreshToken(refreshToken);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Token refresh failed: " + e.getMessage()));
        }
    }

    /**
     * POST /api/auth/logout
     * Logout user (client should discard token)
     * 
     * Note: With JWT, logout is typically handled client-side
     * by removing the token. This endpoint is for completeness.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // With stateless JWT, we can't invalidate tokens server-side
        // Client should remove the token from storage
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
