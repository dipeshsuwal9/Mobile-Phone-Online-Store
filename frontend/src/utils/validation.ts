"""
Form validation utilities for frontend.
"""

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule[];
}

export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Check if it's between 10-15 digits
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Validate password strength
 */
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

/**
 * Validate a single field against rules
 */
export const validateField = (
  value: any,
  rules: ValidationRule[]
): string | null => {
  for (const rule of rules) {
    // Required check
    if (rule.required && (!value || value.toString().trim() === '')) {
      return rule.message;
    }

    // Skip other validations if value is empty and not required
    if (!value || value.toString().trim() === '') {
      continue;
    }

    // Min length check
    if (rule.minLength && value.toString().length < rule.minLength) {
      return rule.message;
    }

    // Max length check
    if (rule.maxLength && value.toString().length > rule.maxLength) {
      return rule.message;
    }

    // Pattern check
    if (rule.pattern && !rule.pattern.test(value.toString())) {
      return rule.message;
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      return rule.message;
    }
  }

  return null;
};

/**
 * Validate form data against validation rules
 */
export const validateForm = (
  data: Record<string, any>,
  rules: ValidationRules
): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const fieldValue = data[field];
    const error = validateField(fieldValue, fieldRules);

    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

/**
 * Common validation rules
 */
export const commonValidationRules = {
  email: [
    {
      required: true,
      message: 'Email is required',
    },
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
  ],
  password: [
    {
      required: true,
      message: 'Password is required',
    },
    {
      minLength: 8,
      message: 'Password must be at least 8 characters',
    },
  ],
  strongPassword: [
    {
      required: true,
      message: 'Password is required',
    },
    {
      minLength: 8,
      message: 'Password must be at least 8 characters',
    },
    {
      custom: (value: string) => /^(?=.*[a-z])/.test(value),
      message: 'Password must contain at least one lowercase letter',
    },
    {
      custom: (value: string) => /^(?=.*[A-Z])/.test(value),
      message: 'Password must contain at least one uppercase letter',
    },
    {
      custom: (value: string) => /^(?=.*\d)/.test(value),
      message: 'Password must contain at least one number',
    },
    {
      custom: (value: string) => /^(?=.*[@$!%*?&])/.test(value),
      message: 'Password must contain at least one special character',
    },
  ],
  phone: [
    {
      required: true,
      message: 'Phone number is required',
    },
    {
      custom: isValidPhoneNumber,
      message: 'Please enter a valid phone number',
    },
  ],
  required: (fieldName: string): ValidationRule[] => [
    {
      required: true,
      message: `${fieldName} is required`,
    },
  ],
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};
