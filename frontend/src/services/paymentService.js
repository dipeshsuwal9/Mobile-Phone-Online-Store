import api from './api';

export const paymentService = {
    // Get user's payments
    getMyPayments: async () => {
        const response = await api.get('/payments/my_payments/');
        return response.data;
    },

    // Create payment for order
    createPayment: async (orderId, paymentMethod, transactionId = '', notes = '') => {
        const response = await api.post('/payments/create_payment/', {
            order_id: orderId,
            payment_method: paymentMethod,
            transaction_id: transactionId,
            notes,
        });
        return response.data;
    },

    // Get payment by ID
    getPaymentById: async (id) => {
        const response = await api.get(`/payments/${id}/`);
        return response.data;
    },
};
