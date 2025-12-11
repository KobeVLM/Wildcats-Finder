package com.wildcatsfinder.wildcats_finder.security;

import com.wildcatsfinder.wildcats_finder.entity.UserEntity;
import com.wildcatsfinder.wildcats_finder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * UserDetailsServiceImpl - Loads user data for Spring Security
 * 
 * Spring Security uses this to:
 * 1. Find users during authentication
 * 2. Check if account is valid (not suspended)
 * 3. Load user's roles/permissions
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Load user by email (we use email as the username)
     * 
     * This method is called by Spring Security during authentication
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Find user in database by email
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Check if user is suspended
        if (user.getSuspended() != null && user.getSuspended()) {
            throw new UsernameNotFoundException("Account is suspended: " + user.getSuspendReason());
        }

        // Create Spring Security User object
        // This is what Spring Security uses to check authentication
        return new User(
                user.getEmail(),                     // Username (email)
                user.getPassword(),                  // Hashed password
                Collections.singletonList(           // Roles/Authorities
                        new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase())
                )
        );
    }
}
