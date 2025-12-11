package com.wildcatsfinder.wildcats_finder.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JwtAuthenticationFilter - Intercepts every request to check for JWT token
 * 
 * This filter:
 * 1. Extracts JWT token from the Authorization header
 * 2. Validates the token
 * 3. Sets the user in Spring Security context if valid
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    /**
     * This method runs for EVERY request
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        try {
            // Step 1: Get JWT token from request header
            String jwt = getJwtFromRequest(request);

            // Step 2: Validate token and set authentication
            if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
                
                // Step 3: Get email from token
                String email = jwtTokenProvider.getEmailFromToken(jwt);

                // Step 4: Load user details from database
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                // Step 5: Create authentication object
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails,           // Principal (the user)
                        null,                  // Credentials (not needed, already authenticated)
                        userDetails.getAuthorities()  // User's roles/permissions
                    );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Step 6: Set authentication in Security Context
                // This tells Spring Security "this user is authenticated"
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            System.out.println("Could not set user authentication in security context: " + ex.getMessage());
        }

        // Continue with the next filter in the chain
        filterChain.doFilter(request, response);
    }

    /**
     * Extract JWT token from the Authorization header
     * 
     * Header format: "Authorization: Bearer <token>"
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        
        // Check if header exists and starts with "Bearer "
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            // Return the token part (after "Bearer ")
            return bearerToken.substring(7);
        }
        
        return null;
    }
}
