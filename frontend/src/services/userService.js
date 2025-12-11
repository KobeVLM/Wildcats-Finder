import api from './api';

/**
 * User Service - Handles user-related API calls (admin and profile)
 */
const userService = {
    /**
     * Get user by ID
     */
    getUserById: async (userId) => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    /**
     * Update user profile
     */
    updateProfile: async (userId, userData) => {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    },

    /**
     * Get all users (admin only)
     */
    getAllUsers: async () => {
        const response = await api.get('/users/admin/all');
        return response.data;
    },

    /**
     * Get user statistics (admin only)
     */
    getUserStats: async () => {
        const response = await api.get('/users/admin/stats');
        return response.data;
    },

    /**
     * Suspend a user (admin only)
     */
    suspendUser: async (userId, reason) => {
        const response = await api.put(`/users/${userId}/suspend`, { reason });
        return response.data;
    },

    /**
     * Unsuspend a user (admin only)
     */
    unsuspendUser: async (userId) => {
        const response = await api.put(`/users/${userId}/unsuspend`);
        return response.data;
    },

    /**
     * Delete a user (admin only)
     */
    deleteUser: async (userId) => {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    },

    /**
     * Check if username exists
     */
    checkUsername: async (username) => {
        const response = await api.get(`/users/check/username/${username}`);
        return response.data;
    },

    /**
     * Check if email exists
     */
    checkEmail: async (email) => {
        const response = await api.get(`/users/check/email/${email}`);
        return response.data;
    }
};

export default userService;
