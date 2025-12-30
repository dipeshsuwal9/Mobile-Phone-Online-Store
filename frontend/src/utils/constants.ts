"""
Common constants for frontend application.
"""

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Debounce Delays
export const SEARCH_DEBOUNCE_DELAY = 300;
export const INPUT_DEBOUNCE_DELAY = 500;

// Cache Keys
export const CACHE_KEYS = {
  AUTH_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  CART_DATA: 'cart_data',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
  REMEMBER_ME: 'remember_me',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.PROCESSING]: 'Processing',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
} as const;

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: '#FFA500',
  [ORDER_STATUS.PROCESSING]: '#2196F3',
  [ORDER_STATUS.SHIPPED]: '#9C27B0',
  [ORDER_STATUS.DELIVERED]: '#4CAF50',
  [ORDER_STATUS.CANCELLED]: '#F44336',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.COMPLETED]: 'Completed',
  [PAYMENT_STATUS.FAILED]: 'Failed',
  [PAYMENT_STATUS.REFUNDED]: 'Refunded',
} as const;

// Product Types
export const PRODUCT_TYPES = {
  PHONE: 'PHONE',
  ACCESSORY: 'ACCESSORY',
} as const;

// Image Settings
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const IMAGE_QUALITY = 0.85;

// Validation Constraints
export const VALIDATION_CONSTRAINTS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 15,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_ADDRESS_LENGTH: 10,
  MAX_ADDRESS_LENGTH: 500,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 99,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'A server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  INSUFFICIENT_STOCK: 'Insufficient stock available.',
  CART_EMPTY: 'Your cart is empty.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  REGISTER_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  CART_UPDATED: 'Cart updated successfully!',
  ORDER_CREATED: 'Order placed successfully!',
  PAYMENT_COMPLETED: 'Payment completed successfully!',
  ITEM_ADDED: 'Item added to cart!',
  ITEM_REMOVED: 'Item removed from cart!',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  PHONES: '/phones',
  PHONE_DETAIL: '/phones/:id',
  ACCESSORIES: '/accessories',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
} as const;

// Animation Durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Toast Notification Duration (ms)
export const TOAST_DURATION = {
  SHORT: 2000,
  NORMAL: 3000,
  LONG: 5000,
} as const;

// Breakpoints (px)
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1280,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const;
