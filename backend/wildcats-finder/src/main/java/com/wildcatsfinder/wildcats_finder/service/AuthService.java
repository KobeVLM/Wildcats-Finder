package com.wildcatsfinder.wildcats_finder.service;

import com.wildcatsfinder.wildcats_finder.dto.*;
import com.wildcatsfinder.wildcats_finder.entity.UserEntity;
import com.wildcatsfinder.wildcats_finder.repository.UserRepository;
import com.wildcatsfinder.wildcats_finder.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/**
 * AuthService - Handles all authentication-related business logic
 * 
 * This service handles:
 * 1. User registration with password hashing
 * 2. User login with JWT token generation
 * 3. Token refresh
 * 4. Password changes
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Register a new user
     * 
     * @param request - Registration data
     * @return AuthResponseDTO with JWT token and user data
     */
    public AuthResponseDTO register(RegisterRequestDTO request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        // Create new user entity
        UserEntity user = new UserEntity();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        
        // HASH THE PASSWORD - never store plain text!
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        user.setFName(request.getFName());
        user.setMName(request.getMName());
        user.setLName(request.getLName());
        user.setContactNo(request.getContactNo());
        user.setStudentId(request.getStudentId());

        // Determine role based on email domain
        // CIT-U admin emails end with @wildcatsf.com (for testing)
        if (request.getEmail().endsWith("@wildcatsf.com")) {
            user.setRole("ADMIN");
        } else {
            user.setRole("USER");
        }

        user.setSuspended(false);

        // Save user to database
        UserEntity savedUser = userRepository.save(user);

        // Generate JWT tokens
        String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole());
        String refreshToken = jwtTokenProvider.generateRefreshToken(savedUser.getEmail());

        // Create UserDTO (without password)
        UserDTO userDTO = convertToDTO(savedUser);

        return new AuthResponseDTO(token, refreshToken, userDTO);
    }

    /**
     * Login a user
     * 
     * @param request - Login credentials
     * @return AuthResponseDTO with JWT token and user data
     */
    public AuthResponseDTO login(AuthRequestDTO request) {
        // Find user by email
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Check if account is suspended
        if (user.getSuspended() != null && user.getSuspended()) {
            throw new RuntimeException("Account suspended: " + user.getSuspendReason());
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT tokens
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        // Create UserDTO (without password)
        UserDTO userDTO = convertToDTO(user);

        return new AuthResponseDTO(token, refreshToken, userDTO);
    }

    /**
     * Refresh an expired token
     * 
     * @param refreshToken - The refresh token
     * @return New AuthResponseDTO with fresh tokens
     */
    public AuthResponseDTO refreshToken(String refreshToken) {
        // Validate refresh token
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        // Get email from refresh token
        String email = jwtTokenProvider.getEmailFromToken(refreshToken);

        // Find user
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate new tokens
        String newToken = jwtTokenProvider.generateToken(user.getEmail(), user.getRole());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        UserDTO userDTO = convertToDTO(user);

        return new AuthResponseDTO(newToken, newRefreshToken, userDTO);
    }

    /**
     * Change user's password
     * 
     * @param userId - User ID
     * @param request - Password change data
     */
    public void changePassword(Long userId, PasswordChangeDTO request) {
        // Find user
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Check if new password matches confirmation
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New passwords do not match");
        }

        // Update password (hashed)
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    /**
     * Convert UserEntity to UserDTO (hide sensitive fields)
     */
    private UserDTO convertToDTO(UserEntity user) {
        return new UserDTO(
                user.getUserId(),
                user.getUsername(),
                user.getFName(),
                user.getMName(),
                user.getLName(),
                user.getEmail(),
                user.getContactNo(),
                user.getRole(),
                new ArrayList<>()  // Don't include items in login response
        );
    }
}
