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

    // Handle error response with custom format
    if (data?.error?.message) {
      return data.error.message;
    }

    // Handle standard error responses
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
 */
export const extractFieldErrors = (error: any): Record<string, string> => {
  if (error.response?.data?.error?.details) {
    const details = error.response.data.error.details;
    const fieldErrors: Record<string, string> = {};

    Object.keys(details).forEach((key) => {
      if (Array.isArray(details[key])) {
        fieldErrors[key] = details[key][0];
      } else {
        fieldErrors[key] = details[key];
      }
    });

    return fieldErrors;
  }

  return {};
};

/**
 * Log error to console in development
 */
export const logError = (error: any, context?: string): void => {
  if (import.meta.env.DEV) {
    const timestamp = new Date().toISOString();
    const errorInfo = {
      timestamp,
      context,
      error: {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      },
    };
    // Only log in development
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
