import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Create the context
const AuthContext = createContext(null);

/**
 * AuthProvider - Provides authentication state to the entire app
 * 
 * Usage:
 * 1. Wrap your App component with <AuthProvider>
 * 2. Use useAuth() hook in any component to access auth state
 * 
 * Example:
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const initAuth = () => {
            try {
                const savedUser = authService.getCurrentUser();
                if (savedUser && authService.isLoggedIn()) {
                    setUser(savedUser);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Clear invalid data
                authService.logout();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     * @returns {Object} - User data
     */
    const login = async (email, password) => {
        const response = await authService.login(email, password);
        setUser(response.user);
        return response;
    };

    /**
     * Register new user
     * @param {Object} userData 
     * @returns {Object} - User data
     */
    const register = async (userData) => {
        const response = await authService.register(userData);
        setUser(response.user);
        return response;
    };

    /**
     * Logout user
     */
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    /**
     * Update user in context (after profile edit)
     */
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    // Context value
    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role?.toUpperCase() === 'ADMIN',
        login,
        register,
        logout,
        updateUser,
    };

    // Show loading while initializing
    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * useAuth hook - Access auth context from any component
 * 
 * @returns {Object} - { user, login, logout, isAuthenticated, isAdmin, ... }
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
