package com.wildcatsfinder.wildcats_finder.controller;

import com.wildcatsfinder.wildcats_finder.entity.UserEntity;
import com.wildcatsfinder.wildcats_finder.service.UserService;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // For React frontend
public class UserController {

    @Autowired
    private UserService userService;

    // DTO for user registration
    // Used JsonProperty to Fix mapping issues
    public static class UserRegistrationRequest {
        @JsonProperty("username")
        private String username;

        @JsonProperty("password")
        private String password;

        @JsonProperty("fName")
        private String fName;

        @JsonProperty("mName")
        private String mName;

        @JsonProperty("lName")
        private String lName;

        @JsonProperty("email")
        private String email;

        @JsonProperty("contactNo")
        private String contactNo;

        // Constructors
        public UserRegistrationRequest() {
        }

        // Getters and Setters
        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getFName() {
            return fName;
        }

        public void setFName(String fName) {
            this.fName = fName;
        }

        public String getMName() {
            return mName;
        }

        public void setMName(String mName) {
            this.mName = mName;
        }

        public String getLName() {
            return lName;
        }

        public void setLName(String lName) {
            this.lName = lName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getContactNo() {
            return contactNo;
        }

        public void setContactNo(String contactNo) {
            this.contactNo = contactNo;
        }
    }

    // DTO for user login
    public static class UserLoginRequest {
        private String username;
        private String password;

        // Constructors
        public UserLoginRequest() {
        }

        // Getters and Setters
        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // POST /api/users/register
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationRequest request) {
        try {
            // Basic validation
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Username is required");
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (request.getFName() == null || request.getFName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("First name is required");
            }
            if (request.getLName() == null || request.getLName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Last name is required");
            }

            // Check if username already exists
            if (userService.isUsernameExists(request.getUsername())) {
                return ResponseEntity.badRequest().body("Username already exists");
            }

            // Check if email already exists
            if (userService.isEmailExists(request.getEmail())) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            // Create new user entity
            UserEntity user = new UserEntity();
            user.setUsername(request.getUsername());
            user.setPassword(request.getPassword()); // In production, hash this password
            user.setFName(request.getFName());
            user.setMName(request.getMName());
            user.setLName(request.getLName());
            user.setEmail(request.getEmail());
            user.setContactNo(request.getContactNo());

            // Register user with auto-assigned "USER" role
            UserEntity savedUser = userService.registerUser(user);

            // Don't return password in response
            savedUser.setPassword(null);
            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error registering user: " + e.getMessage());
        }
    }

    // LOGIN: Authenticate user
    // POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginRequest request) {
        try {
            // Validate required fields
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Username is required");
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }

            // Authenticate user
            UserEntity user = userService.loginUser(request.getUsername(), request.getPassword());

            // Don't return password in response
            user.setPassword(null);
            return ResponseEntity.ok(user);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials: " + e.getMessage());
        }
    }

    // READ: Get all users (admin functionality)
    // GET /api/users
    @GetMapping
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        try {
            List<UserEntity> users = userService.getAllUsers();
            // Remove passwords from response
            users.forEach(user -> user.setPassword(null));
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get user by ID
    // GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            UserEntity user = userService.getUserById(id);
            // Don't return password
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found: " + e.getMessage());
        }
    }

    // READ: Get user by username
    // GET /api/users/username/{username}
    @GetMapping("/username/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        try {
            UserEntity user = userService.getUserByUsername(username);
            // Don't return password
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found: " + e.getMessage());
        }
    }

    // READ: Get user by email
    // GET /api/users/email/{email}
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        try {
            UserEntity user = userService.getUserByEmail(email);
            // Don't return password
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found: " + e.getMessage());
        }
    }

    // UPDATE: Update user profile
    // PUT /api/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserRegistrationRequest request) {
        try {
            // Get existing user
            UserEntity existingUser = userService.getUserById(id);

            // Update fields (keeping existing password if not provided)
            if (request.getUsername() != null)
                existingUser.setUsername(request.getUsername());
            if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
                existingUser.setPassword(request.getPassword()); // Hash in production
            }
            if (request.getFName() != null)
                existingUser.setFName(request.getFName());
            if (request.getMName() != null)
                existingUser.setMName(request.getMName());
            if (request.getLName() != null)
                existingUser.setLName(request.getLName());
            if (request.getEmail() != null)
                existingUser.setEmail(request.getEmail());
            if (request.getContactNo() != null)
                existingUser.setContactNo(request.getContactNo());

            // Save updated user
            UserEntity updatedUser = userService.updateUser(id, existingUser);

            // Don't return password
            updatedUser.setPassword(null);
            return ResponseEntity.ok(updatedUser);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error updating user: " + e.getMessage());
        }
    }

    // DELETE: Delete user (admin functionality)
    // DELETE /api/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            String result = userService.deleteUser(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error deleting user: " + e.getMessage());
        }
    }

    // CHECK: Check if username exists
    // GET /api/users/check/username/{username}
    @GetMapping("/check/username/{username}")
    public ResponseEntity<Boolean> checkUsernameExists(@PathVariable String username) {
        try {
            boolean exists = userService.isUsernameExists(username);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }

    // CHECK: Check if email exists
    // GET /api/users/check/email/{email}
    @GetMapping("/check/email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        try {
            boolean exists = userService.isEmailExists(email);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }
}