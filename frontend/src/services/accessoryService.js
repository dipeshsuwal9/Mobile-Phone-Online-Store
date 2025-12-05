import api from './api';

export const accessoryService = {
    // Get all accessories
    getAllAccessories: async (params = {}) => {
        const response = await api.get('/accessories/', { params });
        return response.data;
    },

    // Get accessory by ID
    getAccessoryById: async (id) => {
        const response = await api.get(`/accessories/${id}/`);
        return response.data;
    },

    // Search accessories
    searchAccessories: async (searchTerm) => {
        const response = await api.get('/accessories/', { params: { search: searchTerm } });
        return response.data;
    },

    // Filter accessories by category
    filterByCategory: async (category) => {
        const response = await api.get('/accessories/', { params: { category } });
        return response.data;
    },
};
