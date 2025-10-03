// src/services/authApi.js

import axios from 'axios';

// Get base URL from environment variable for easy switching
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTH_URL = `${API_URL}/auth`;

// Helper to get the JWT from localStorage (used if a component needs to call this directly)
// NOTE: For authenticated calls, axios default headers are set in authContext, 
// so you typically don't need to manually pass the token here.
// const getToken = () => localStorage.getItem('token'); 

const authApi = {
    /**
     * POST /api/auth/login
     * @param {string} email
     * @param {string} password
     * @returns {Promise<object>} { user, token, message }
     */
    login: async (email, password) => {
        const response = await axios.post(`${AUTH_URL}/login`, { email, password });
        return response.data;
    },

    /**
     * POST /api/auth/register
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @returns {Promise<object>} { user, token, message }
     */
    register: async (name, email, password) => {
        const response = await axios.post(`${AUTH_URL}/register`, { name, email, password });
        return response.data;
    },

    /**
     * GET /api/auth/profile (Protected)
     * Requires Authorization: Bearer <token> set in default headers
     * @returns {Promise<object>} { user }
     */
    getProfile: async () => {
        const response = await axios.get(`${AUTH_URL}/profile`);
        return response.data;
    },

    /**
     * PUT /api/auth/profile (Protected)
     * Requires Authorization: Bearer <token> set in default headers
     * @param {object} updateData { name?: string, email?: string }
     * @returns {Promise<object>} { user, message }
     */
    updateProfile: async (updateData) => {
        const response = await axios.put(`${AUTH_URL}/profile`, updateData);
        return response.data;
    },

    /**
     * PUT /api/auth/change-password (Protected)
     * Requires Authorization: Bearer <token> set in default headers
     * @param {string} currentPassword
     * @param {string} newPassword
     * @returns {Promise<object>} { message }
     */
    changePassword: async (currentPassword, newPassword) => {
        const response = await axios.put(`${AUTH_URL}/change-password`, { currentPassword, newPassword });
        return response.data;
    },
};

export default authApi;