import api from './api';

export const phoneService = {
    // Get all phones
    getAllPhones: async (params = {}) => {
        const response = await api.get('/phones/', { params });
        return response.data;
    },

    // Get phone by ID
    getPhoneById: async (id) => {
        const response = await api.get(`/phones/${id}/`);
        return response.data;
    },

    // Search phones
    searchPhones: async (searchTerm) => {
        const response = await api.get('/phones/', { params: { search: searchTerm } });
        return response.data;
    },

    // Filter phones
    filterPhones: async (filters) => {
        const response = await api.get('/phones/', { params: filters });
        return response.data;
    },
};

export const brandService = {
    // Get all brands
    getAllBrands: async () => {
        const response = await api.get('/phones/brands/');
        return response.data;
    },

    // Get brand by ID
    getBrandById: async (id) => {
        const response = await api.get(`/phones/brands/${id}/`);
        return response.data;
    },
};
