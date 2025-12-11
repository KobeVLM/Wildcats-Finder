import api from './api';

/**
 * Auth Service - Handles authentication API calls
 */
const authService = {
    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise} - Response with token and user data
     */
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        
        // Store tokens and user in localStorage
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    },

    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Promise}
     */
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        
        // Auto-login after registration
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    },

    /**
     * Logout user
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    /**
     * Get current user from localStorage
     * @returns {Object|null}
     */
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Check if user is logged in
     * @returns {boolean}
     */
    isLoggedIn: () => {
        return !!localStorage.getItem('token');
    },

    /**
     * Alias for isLoggedIn (for compatibility)
     * @returns {boolean}
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    /**
     * Get JWT token
     * @returns {string|null}
     */
    getToken: () => {
        return localStorage.getItem('token');
    },

    /**
     * Refresh token
     * @returns {Promise}
     */
    refreshToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/auth/refresh', { refreshToken });
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        
        return response.data;
    },

    /**
     * Change password
     * @param {Long} userId 
     * @param {Object} passwordData - { currentPassword, newPassword, confirmPassword }
     * @returns {Promise}
     */
    changePassword: async (userId, passwordData) => {
        const response = await api.put(`/users/${userId}/password`, passwordData);
        return response.data;
    }
};

export default authService;
