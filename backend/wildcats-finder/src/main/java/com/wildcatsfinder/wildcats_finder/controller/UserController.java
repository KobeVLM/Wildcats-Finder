package com.wildcatsfinder.wildcats_finder.controller;
import java.util.Map;

import com.wildcatsfinder.wildcats_finder.dto.ItemDTO;
import com.wildcatsfinder.wildcats_finder.dto.UserDTO;
import com.wildcatsfinder.wildcats_finder.entity.UserEntity;
import com.wildcatsfinder.wildcats_finder.service.UserService;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;

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

        @JsonProperty("role")
        private String role;

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

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
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
            System.out.println("=== DEBUG: Registration Request ===");
            System.out.println("Username: " + request.getUsername());
            System.out.println("Email: " + request.getEmail());
            System.out.println("Role from request: '" + request.getRole() + "'");
            
            // validation
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
            user.setPassword(request.getPassword()); // TODO: convert to hashed password
            user.setFName(request.getFName());
            user.setMName(request.getMName());
            user.setLName(request.getLName());
            user.setEmail(request.getEmail());
            user.setContactNo(request.getContactNo());

            // Determine role based on email domain
            String role = request.getRole();
            System.out.println("Role from frontend: '" + role + "'");
            
            if (role == null || role.trim().isEmpty()) {
                // Auto-detect role based on email domain
                if (request.getUsername().contains("@wildcatsf.com") || 
                    request.getEmail().contains("@wildcatsf.com")) {
                    role = "ADMIN";
                    System.out.println("Auto-detected role: ADMIN (wildcatsf.com domain)");
                } else {
                    role = "USER";
                    System.out.println("Auto-detected role: USER");
                }
            }
            
            user.setRole(role);
            System.out.println("Final role being set: " + user.getRole());

            // Register user
            UserEntity savedUser = userService.registerUser(user);

            // return data without password 
            savedUser.setPassword(null);
            System.out.println("User registered successfully with role: " + savedUser.getRole());
            System.out.println("================================");
            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {
            System.out.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error registering user: " + e.getMessage());
        }
    }

    // POST /api/users/register/admin
    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody UserRegistrationRequest request) {        
        try {
            // validation
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

            // Create new admin user entity
            UserEntity user = new UserEntity();
            user.setUsername(request.getUsername());
            user.setPassword(request.getPassword()); // TODO: convert to hashed password
            user.setFName(request.getFName());
            user.setMName(request.getMName());
            user.setLName(request.getLName());
            user.setEmail(request.getEmail());
            user.setContactNo(request.getContactNo());
            user.setRole("ADMIN"); // Set admin role

            // Register admin user
            UserEntity savedUser = userService.registerUser(user);

            // return data without password 
            savedUser.setPassword(null);
            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error registering admin: " + e.getMessage());
        }
    }

    // POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginRequest request) {
        try {
            System.out.println("\n=== CONTROLLER DEBUG - loginUser ===");
            System.out.println("Login attempt for username: " + request.getUsername());
            
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
            }

            // Authenticate
            UserEntity user = userService.loginUser(request.getUsername(), request.getPassword());
            
            System.out.println("User entity received from service:");
            System.out.println("  fName: '" + user.getFName() + "'");
            System.out.println("  mName: '" + user.getMName() + "'");
            System.out.println("  lName: '" + user.getLName() + "'");
            System.out.println("  Role: '" + user.getRole() + "'");

            // Map reported items to DTO
            List<ItemDTO> itemDTOs = user.getReportedItems()
                                         .stream()
                                         .map(ItemDTO::new)
                                         .toList();

            // Build UserDTO
            UserDTO userDTO = new UserDTO(
                user.getUserId(),
                user.getUsername(),
                user.getFName(),
                user.getMName(),
                user.getLName(),
                user.getEmail(),
                user.getContactNo(),
                user.getRole(), // This includes the role!
                itemDTOs
            );

            System.out.println("UserDTO created:");
            System.out.println("  DTO fName: '" + userDTO.getFName() + "'");
            System.out.println("  DTO mName: '" + userDTO.getMName() + "'");
            System.out.println("  DTO lName: '" + userDTO.getLName() + "'");
            System.out.println("  DTO Role: '" + userDTO.getRole() + "'");
            
            // Also print the entire DTO as JSON
            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writeValueAsString(userDTO);
            System.out.println("Full DTO JSON: " + json);
            System.out.println("=== END DEBUG ===\n");

            return ResponseEntity.ok(userDTO);

        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "Nope!, Please try again"));
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
                existingUser.setPassword(request.getPassword()); // TODO: convert to hashed password
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