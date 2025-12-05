import api from './api';

export const authService = {
    // Register new customer
    register: async (userData) => {
        const response = await api.post('/customers/register/', userData);
        return response.data;
    },

    // Login
    login: async (email, password) => {
        const response = await api.post('/customers/login/', { email, password });
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
        }
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },

    // Get current user profile
    getProfile: async () => {
        const response = await api.get('/customers/profiles/me/');
        return response.data;
    },

    // Update profile
    updateProfile: async (userData) => {
        const response = await api.put('/customers/profiles/update_profile/', userData);
        return response.data;
    },

    // Change password
    changePassword: async (passwordData) => {
        const response = await api.post('/customers/profiles/change_password/', passwordData);
        return response.data;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    },
};
