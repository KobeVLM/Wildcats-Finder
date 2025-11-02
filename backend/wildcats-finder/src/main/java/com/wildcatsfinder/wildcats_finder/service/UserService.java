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

    // REGISTER: Register a new user with auto-assigned USER role
    public UserEntity registerUser(UserEntity user) {
        // Auto-assign USER role for new registrations
        user.setRole("USER");
        return userRepository.save(user);
    }

    // LOGIN: Validate user login credentials
    public UserEntity loginUser(String username, String password) {
        Optional<UserEntity> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            UserEntity foundUser = user.get();
            // Simple password check (you might want to use BCrypt in production)
            if (foundUser.getPassword().equals(password)) {
                return foundUser;
            } else {
                throw new NoSuchElementException("Invalid password for user: " + username);
            }
        } else {
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
}