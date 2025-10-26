import axios from 'axios';

// Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTH_URL = `${API_URL}/auth`;
const ADMIN_URL = `${API_URL}/admin`;

// Helper for JWT headers is handled in AuthContext
const authApi = {
    // -------- AUTH ----------
    login: async (email, password) => {
        const response = await axios.post(`${AUTH_URL}/login`, { email, password });
        return response.data;
    },

    register: async (name, email, password, role = 'Project Content Managers') => {
        const response = await axios.post(`${AUTH_URL}/register`, { name, email, password, role });
        return response.data;
    },

    getProfile: async () => {
        const response = await axios.get(`${AUTH_URL}/profile`);
        return response.data;
    },

    updateProfile: async (updateData) => {
        const response = await axios.put(`${AUTH_URL}/profile`, updateData);
        return response.data;
    },

    changePassword: async (currentPassword, newPassword) => {
        const response = await axios.put(`${AUTH_URL}/change-password`, { currentPassword, newPassword });
        return response.data;
    },

    // -------- ADMIN USER MANAGEMENT ----------
    getAllUsers: async () => {
        const response = await axios.get(`${ADMIN_URL}/users`);
        return response.data;
    },

    createUser: async (name, email, password, role) => {
        const response = await axios.post(`${ADMIN_URL}/users`, { name, email, password, role });
        return response.data;
    },

    updateUserRole: async (userId, role) => {
        const response = await axios.put(`${ADMIN_URL}/users/${userId}`, { role });
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await axios.delete(`${ADMIN_URL}/users/${userId}`);
        return response.data;
    }
};

export default authApi;
