import api from './api';

/**
 * Notification Service - Handles all notification-related API calls
 */
const notificationService = {
    /**
     * Get all notifications for a user
     */
    getNotifications: async (userId) => {
        const response = await api.get(`/notifications/user/${userId}`);
        return response.data;
    },

    /**
     * Get unread notifications for a user
     */
    getUnreadNotifications: async (userId) => {
        const response = await api.get(`/notifications/user/${userId}/unread`);
        return response.data;
    },

    /**
     * Get unread notification count (for badge)
     */
    getUnreadCount: async (userId) => {
        const response = await api.get(`/notifications/user/${userId}/unread-count`);
        return response.data.count;
    },

    /**
     * Mark a notification as read
     */
    markAsRead: async (notificationId) => {
        const response = await api.put(`/notifications/${notificationId}/read`);
        return response.data;
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async (userId) => {
        const response = await api.put(`/notifications/user/${userId}/read-all`);
        return response.data;
    },

    /**
     * Delete a notification
     */
    deleteNotification: async (notificationId) => {
        const response = await api.delete(`/notifications/${notificationId}`);
        return response.data;
    }
};

export default notificationService;
