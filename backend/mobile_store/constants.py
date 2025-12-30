"""
Constants for the mobile_store project.
Contains magic numbers, string constants, and configuration values.
"""

# Pagination
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# Rate Limiting
RATE_LIMIT_LOGIN = '5/h'
RATE_LIMIT_REGISTER = '3/h'
RATE_LIMIT_API_DEFAULT = '100/h'
RATE_LIMIT_API_STRICT = '30/h'

# JWT Token Lifetimes (in minutes)
JWT_ACCESS_TOKEN_LIFETIME_MINUTES = 60
JWT_REFRESH_TOKEN_LIFETIME_MINUTES = 1440  # 24 hours

# Password Validation
MIN_PASSWORD_LENGTH = 8
MAX_PASSWORD_LENGTH = 128

# File Upload
MAX_UPLOAD_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']
ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

# Order Status Choices
ORDER_STATUS_PENDING = 'PENDING'
ORDER_STATUS_PROCESSING = 'PROCESSING'
ORDER_STATUS_SHIPPED = 'SHIPPED'
ORDER_STATUS_DELIVERED = 'DELIVERED'
ORDER_STATUS_CANCELLED = 'CANCELLED'

# Payment Status Choices
PAYMENT_STATUS_PENDING = 'PENDING'
PAYMENT_STATUS_COMPLETED = 'COMPLETED'
PAYMENT_STATUS_FAILED = 'FAILED'
PAYMENT_STATUS_REFUNDED = 'REFUNDED'

# Product Types
PRODUCT_TYPE_PHONE = 'PHONE'
PRODUCT_TYPE_ACCESSORY = 'ACCESSORY'

# Cache Timeouts (in seconds)
CACHE_TIMEOUT_SHORT = 300  # 5 minutes
CACHE_TIMEOUT_MEDIUM = 900  # 15 minutes
CACHE_TIMEOUT_LONG = 3600  # 1 hour

# Stock Management
LOW_STOCK_THRESHOLD = 10
OUT_OF_STOCK_THRESHOLD = 0

# Search
SEARCH_DEBOUNCE_MS = 300
MAX_SEARCH_RESULTS = 50

# Error Messages
ERROR_AUTHENTICATION_FAILED = "Authentication failed. Please check your credentials."
ERROR_PERMISSION_DENIED = "You don't have permission to perform this action."
ERROR_NOT_FOUND = "The requested resource was not found."
ERROR_VALIDATION_FAILED = "Validation failed. Please check your input."
ERROR_SERVER_ERROR = "An internal server error occurred. Please try again later."
ERROR_INSUFFICIENT_STOCK = "Insufficient stock available."
ERROR_INVALID_PAYMENT = "Invalid payment information."
ERROR_ORDER_NOT_FOUND = "Order not found."
ERROR_CART_EMPTY = "Your cart is empty."

# Success Messages
SUCCESS_ORDER_CREATED = "Order created successfully."
SUCCESS_PAYMENT_COMPLETED = "Payment completed successfully."
SUCCESS_PROFILE_UPDATED = "Profile updated successfully."
SUCCESS_CART_UPDATED = "Cart updated successfully."

# Email Settings
DEFAULT_FROM_EMAIL = 'noreply@mobilestore.com'
ADMIN_EMAIL = 'admin@mobilestore.com'

# API Versioning
API_VERSION = 'v1'
API_PREFIX = f'/api/{API_VERSION}'

# Security
MAX_LOGIN_ATTEMPTS = 5
LOGIN_ATTEMPT_TIMEOUT = 3600  # 1 hour
CSRF_TRUSTED_ORIGINS = []

# Database Query Optimization
SELECT_RELATED_DEPTH = 2
PREFETCH_BATCH_SIZE = 100
