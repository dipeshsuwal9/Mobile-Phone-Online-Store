import api from './api';

export const cartService = {
    // Get user's cart
    getCart: async () => {
        const response = await api.get('/cart/my_cart/');
        return response.data;
    },

    // Add item to cart
    addToCart: async (productType, productId, quantity = 1) => {
        const response = await api.post('/cart/add_item/', {
            product_type: productType,
            product_id: productId,
            quantity,
        });
        return response.data;
    },

    // Update item quantity
    updateCartItem: async (cartItemId, quantity) => {
        const response = await api.patch('/cart/update_item/', {
            cart_item_id: cartItemId,
            quantity,
        });
        return response.data;
    },

    // Remove item from cart
    removeFromCart: async (cartItemId) => {
        const response = await api.delete('/cart/remove_item/', {
            params: { cart_item_id: cartItemId },
        });
        return response.data;
    },

    // Clear cart
    clearCart: async () => {
        const response = await api.delete('/cart/clear_cart/');
        return response.data;
    },
};
