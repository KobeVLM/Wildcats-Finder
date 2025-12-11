import api from './api';

/**
 * Item Service - Handles all item-related API calls
 */
const itemService = {
    /**
     * Get all active items (LOST, FOUND) - public
     */
    getActiveItems: async () => {
        const response = await api.get('/items/active');
        return response.data;
    },

    /**
     * Get all items (including pending for admin)
     */
    getAllItems: async () => {
        const response = await api.get('/items');
        return response.data;
    },

    /**
     * Get pending items (admin only)
     */
    getPendingItems: async () => {
        const response = await api.get('/items/pending');
        return response.data;
    },

    /**
     * Get item by ID
     */
    getItemById: async (itemId) => {
        const response = await api.get(`/items/${itemId}`);
        return response.data;
    },

    /**
     * Get items by user
     */
    getItemsByUser: async (userId) => {
        const response = await api.get(`/items/user/${userId}`);
        return response.data;
    },

    /**
     * Get items by status
     */
    getItemsByStatus: async (status) => {
        const response = await api.get(`/items/status/${status}`);
        return response.data;
    },

    /**
     * Report a new item (with image upload)
     */
    reportItem: async (formData) => {
        const response = await api.post('/items/report', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Update item
     */
    updateItem: async (itemId, formData) => {
        const response = await api.put(`/items/${itemId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Delete item
     */
    deleteItem: async (itemId) => {
        const response = await api.delete(`/items/${itemId}`);
        return response.data;
    },

    /**
     * Approve pending item (admin only)
     */
    approveItem: async (itemId, targetStatus) => {
        const response = await api.put(`/items/${itemId}/approve`, { targetStatus });
        return response.data;
    },

    /**
     * Reject pending item (admin only)
     */
    rejectItem: async (itemId, reason) => {
        const response = await api.put(`/items/${itemId}/reject`, { reason });
        return response.data;
    },

    /**
     * Search active items
     */
    searchItems: async (keyword) => {
        const response = await api.get(`/items/search/active?keyword=${encodeURIComponent(keyword)}`);
        return response.data;
    },

    /**
     * Get item statistics
     */
    getStats: async () => {
        const response = await api.get('/items/stats');
        return response.data;
    }
};

export default itemService;
