/**
 *Error handling utilities for frontend.
 */

export interface ApiError {
  message: string;
  code: number;
  details?: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * Custom error class for API errors
 */
export class ApiException extends Error {
  code: number;
  details?: Record<string, any>;

  constructor(message: string, code: number, details?: Record<string, any>) {
    super(message);
    this.name = "ApiException";
    this.code = code;
    this.details = details;
  }
}

/**
 * Handle API errors and return user-friendly messages
 */
export const handleApiError = (error: any): string => {
  // Check if it's an ApiException
  if (error instanceof ApiException) {
    return error.message;
  }

  // Check if it's an axios error
  if (error.response) {
    const { status, data } = error.response;

    // Handle custom error response format: { "error": { "message": "...", "details": {...} } }
    if (data?.error?.message) {
      return data.error.message;
    }

    // Handle standard DRF error responses
    if (data?.detail) {
      return data.detail;
    }

    if (data?.message) {
      return data.message;
    }

    // Default status code messages
    switch (status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Authentication required. Please log in.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return `An error occurred (${status}). Please try again.`;
    }
  }

  // Network error
  if (error.request) {
    return "Network error. Please check your connection and try again.";
  }

  // Other errors
  return error.message || "An unexpected error occurred.";
};

/**
 * Extract field-specific errors from API response
 * Handles both Django REST framework format and custom error format
 */
export const extractFieldErrors = (error: any): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};

  if (!error.response?.data) {
    return fieldErrors;
  }

  const data = error.response.data;

  // Format 1: Custom error format { "error": { "details": { "field": ["error"] } } }
  if (data?.error?.details && typeof data.error.details === "object") {
    Object.keys(data.error.details).forEach((key) => {
      const value = data.error.details[key];
      if (Array.isArray(value) && value.length > 0) {
        fieldErrors[key] = value[0];
      } else if (typeof value === "string") {
        fieldErrors[key] = value;
      }
    });
    return fieldErrors;
  }

  // Format 2: Direct field errors { "field": ["error message"] }
  Object.keys(data).forEach((key) => {
    // Skip non-field keys
    if (
      ["detail", "message", "error", "success", "non_field_errors"].includes(
        key
      )
    ) {
      return;
    }

    const value = data[key];

    if (Array.isArray(value) && value.length > 0) {
      // Handle array of error messages
      fieldErrors[key] = value[0];
    } else if (typeof value === "string") {
      // Handle direct string error
      fieldErrors[key] = value;
    } else if (typeof value === "object" && value !== null) {
      // Handle nested errors (e.g., password validation)
      const nestedError = Object.values(value)[0];
      if (typeof nestedError === "string") {
        fieldErrors[key] = nestedError;
      } else if (Array.isArray(nestedError) && nestedError.length > 0) {
        fieldErrors[key] = nestedError[0];
      }
    }
  });

  // Handle non_field_errors
  if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
    fieldErrors.general = data.non_field_errors[0];
  }

  // Handle email-specific errors (Django's unique constraint message)
  if (fieldErrors.email && fieldErrors.email.includes("already exists")) {
    fieldErrors.email =
      "An account with this email already exists. Please use a different email or try logging in.";
  }

  // Handle password2 errors (map to confirmPassword for consistency)
  if (fieldErrors.password2) {
    fieldErrors.confirmPassword = fieldErrors.password2;
    delete fieldErrors.password2;
  }

  return fieldErrors;
};

/**
 * Log error to console in development
 */
export const logError = (error: any, context?: string): void => {
  if (import.meta.env.DEV) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Error in ${context || "unknown"}:`, {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
    });
  }
};

/**
 * Create standardized error response
 */
export const createErrorResponse = (
  message: string,
  code: number = 500,
  details?: Record<string, any>
): ApiResponse<never> => {
  return {
    success: false,
    error: {
      message,
      code,
      details,
    },
  };
};

/**
 * Create standardized success response
 */
export const createSuccessResponse = <T>(data: T): ApiResponse<T> => {
  return {
    success: true,
    data,
  };
};
