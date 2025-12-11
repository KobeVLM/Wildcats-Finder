package com.wildcatsfinder.wildcats_finder.service;

import com.wildcatsfinder.wildcats_finder.entity.UserEntity;
import com.wildcatsfinder.wildcats_finder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // CREATE: Add a new user
    public UserEntity createUser(UserEntity user) {
        return userRepository.save(user);
    }

    // READ: Fetch all users
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    // READ: Fetch a user by its ID
    public UserEntity getUserById(Long id) {
        Optional<UserEntity> user = userRepository.findById(id);
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new NoSuchElementException("User " + id + " not found");
        }
    }

    // READ: Fetch a user by username
    public UserEntity getUserByUsername(String username) {
        Optional<UserEntity> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new NoSuchElementException("User with username '" + username + "' not found");
        }
    }

    // READ: Fetch a user by email
    public UserEntity getUserByEmail(String email) {
        Optional<UserEntity> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new NoSuchElementException("User with email '" + email + "' not found");
        }
    }

    // CHECK: Verify if username already exists
    public boolean isUsernameExists(String username) {
        boolean exists = userRepository.existsByUsername(username);
        if (exists) {
            return true;
        } else {
            return false;
        }
    }

    // CHECK: Verify if email already exists
    public boolean isEmailExists(String email) {
        boolean exists = userRepository.existsByEmail(email);
        if (exists) {
            return true;
        } else {
            return false;
        }
    }

    // UPDATE: Modify an existing user
    public UserEntity updateUser(Long id, UserEntity userDetails) {
        // Check Optional explicitly and assign to a variable
        UserEntity user;
        Optional<UserEntity> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            user = optionalUser.get();
        } else {
            throw new NoSuchElementException("User " + id + " not found");
        }

        // Update user fields
        user.setUsername(userDetails.getUsername());
        user.setPassword(userDetails.getPassword());
        user.setFName(userDetails.getFName());
        user.setMName(userDetails.getMName());
        user.setLName(userDetails.getLName());
        user.setEmail(userDetails.getEmail());
        user.setContactNo(userDetails.getContactNo());
        user.setRole(userDetails.getRole());

        return userRepository.save(user);
    }

    // REGISTER: Register a new user - DO NOT override role
    public UserEntity registerUser(UserEntity user) {
        System.out.println("=== SERVICE DEBUG: registerUser ===");
        System.out.println("Username: " + user.getUsername());
        System.out.println("Role from controller: '" + user.getRole() + "'");
        
        // Just save the user as-is, don't override the role
        UserEntity savedUser = userRepository.save(user);
        
        System.out.println("Saved user role: " + savedUser.getRole());
        System.out.println("=== END SERVICE DEBUG ===");
        
        return savedUser;
    }

    // LOGIN: Validate user login credentials
    public UserEntity loginUser(String username, String password) {
        System.out.println("=== USER SERVICE DEBUG - loginUser ===");
        System.out.println("Looking for user with username: " + username);
        
        System.out.println("Using custom query...");
        
        Optional<UserEntity> user = userRepository.findByUsernameWithItems(username);

        if (user.isPresent()) {
            UserEntity foundUser = user.get();
            
            System.out.println("User found with ID: " + foundUser.getUserId());
            System.out.println("User fName: '" + foundUser.getFName() + "'");
            System.out.println("User mName: '" + foundUser.getMName() + "'");
            System.out.println("User lName: '" + foundUser.getLName() + "'");
            System.out.println("User email: " + foundUser.getEmail());
            System.out.println("User role: " + foundUser.getRole()); // ADDED THIS LINE
            
            // Check if name fields are actually populated
            if (foundUser.getFName() == null) {
                System.out.println("WARNING: fName is NULL!");
            } else {
                System.out.println("fName length: " + foundUser.getFName().length());
            }
            
            // Simple password check (you might want to use BCrypt in production)
            if (foundUser.getPassword().equals(password)) {
                System.out.println("Password matches! Returning user...");
                return foundUser;
            } else {
                System.out.println("Password does NOT match!");
                throw new NoSuchElementException("Invalid password for user: " + username);
            }
        } else {
            System.out.println("User NOT found!");
            throw new NoSuchElementException("User with username '" + username + "' not found");
        }
    }

    // DELETE: Remove a user
    public String deleteUser(Long id) {
        if (userRepository.findById(id).isPresent()) {
            userRepository.deleteById(id);
            return "User " + id + " is successfully deleted!";
        } else {
            return "User " + id + " does not exist.";
        }
    }

    // ========== ADMIN USER MANAGEMENT METHODS ==========

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    /**
     * Suspend a user account (admin only)
     */
    public UserEntity suspendUser(Long userId, String reason) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User " + userId + " not found"));

        if (user.getRole().equalsIgnoreCase("ADMIN")) {
            throw new IllegalStateException("Cannot suspend admin users");
        }

        user.setSuspended(true);
        user.setSuspendReason(reason != null ? reason : "Account suspended by admin");
        
        return userRepository.save(user);
    }

    /**
     * Unsuspend a user account (admin only)
     */
    public UserEntity unsuspendUser(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User " + userId + " not found"));

        user.setSuspended(false);
        user.setSuspendReason(null);
        
        return userRepository.save(user);
    }

    /**
     * Change user password (by admin or user themselves)
     */
    public UserEntity changePassword(Long userId, String newPassword) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User " + userId + " not found"));

        // Hash the new password
        user.setPassword(passwordEncoder.encode(newPassword));
        
        return userRepository.save(user);
    }

    /**
     * Get all users for admin management
     */
    public List<UserEntity> getAllUsersForAdmin() {
        return userRepository.findAll();
    }

    /**
     * Count users by role
     */
    public java.util.Map<String, Long> getUserStats() {
        java.util.Map<String, Long> stats = new java.util.HashMap<>();
        List<UserEntity> users = userRepository.findAll();
        
        long adminCount = users.stream().filter(u -> "ADMIN".equalsIgnoreCase(u.getRole())).count();
        long userCount = users.stream().filter(u -> "USER".equalsIgnoreCase(u.getRole())).count();
        long suspendedCount = users.stream().filter(u -> u.getSuspended() != null && u.getSuspended()).count();
        
        stats.put("total", (long) users.size());
        stats.put("admins", adminCount);
        stats.put("users", userCount);
        stats.put("suspended", suspendedCount);
        
        return stats;
    }
}