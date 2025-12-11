import api from './api';

/**
 * Claim Service - Handles all claim-related API calls
 */
const claimService = {
    /**
     * Get all claims
     */
    getAllClaims: async () => {
        const response = await api.get('/claims');
        return response.data;
    },

    /**
     * Get claims for a specific item
     */
    getClaimsByItem: async (itemId) => {
        const response = await api.get(`/claims/item/${itemId}`);
        return response.data;
    },

    /**
     * Get claims by user
     */
    getClaimsByUser: async (userId) => {
        const response = await api.get(`/claims/user/${userId}`);
        return response.data;
    },

    /**
     * Get pending claims
     */
    getPendingClaims: async () => {
        const response = await api.get('/claims/pending');
        return response.data;
    },

    /**
     * File a new claim
     */
    fileClaim: async (claimData) => {
        const response = await api.post('/claims', claimData);
        return response.data;
    },

    /**
     * Approve a claim
     */
    approveClaim: async (claimId) => {
        const response = await api.put(`/claims/${claimId}/approve`);
        return response.data;
    },

    /**
     * Reject a claim with reason
     */
    rejectClaim: async (claimId, reason) => {
        const response = await api.put(`/claims/${claimId}/reject`, { reason });
        return response.data;
    },

    /**
     * Mark claim as returned
     */
    markAsReturned: async (claimId) => {
        const response = await api.put(`/claims/${claimId}/return`);
        return response.data;
    }
};

export default claimService;
