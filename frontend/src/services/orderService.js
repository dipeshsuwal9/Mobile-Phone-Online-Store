import api from './api';

export const orderService = {
    // Get user's orders
    getMyOrders: async () => {
        const response = await api.get('/orders/my_orders/');
        return response.data;
    },

    // Get order by ID
    getOrderById: async (id) => {
        const response = await api.get(`/orders/${id}/`);
        return response.data;
    },

    // Create order from cart
    createOrderFromCart: async (shippingAddress, notes = '') => {
        const response = await api.post('/orders/create_from_cart/', {
            shipping_address: shippingAddress,
            notes,
        });
        return response.data;
    },

    // Cancel order
    cancelOrder: async (orderId) => {
        const response = await api.post(`/orders/${orderId}/cancel/`);
        return response.data;
    },
};
