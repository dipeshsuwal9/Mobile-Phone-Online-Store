"""
Custom validators for the mobile_store project.
"""

import re
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator, RegexValidator
from .constants import (
    MAX_UPLOAD_SIZE,
    ALLOWED_IMAGE_EXTENSIONS,
    MIN_PASSWORD_LENGTH,
)


def validate_image_file(file):
    """
    Validate uploaded image file size and extension.
    
    Args:
        file: The uploaded file object
        
    Raises:
        ValidationError: If file size exceeds limit or extension is invalid
    """
    if file.size > MAX_UPLOAD_SIZE:
        raise ValidationError(
            f'File size cannot exceed {MAX_UPLOAD_SIZE / (1024 * 1024)}MB'
        )
    
    ext = file.name.split('.')[-1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValidationError(
            f'Invalid file extension. Allowed: {", ".join(ALLOWED_IMAGE_EXTENSIONS)}'
        )


def validate_phone_number(value):
    """
    Validate phone number format.
    Accepts formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
    
    Args:
        value: Phone number string
        
    Raises:
        ValidationError: If phone number format is invalid
    """
    phone_regex = re.compile(
        r'^\+?1?\d{9,15}$'
    )
    if not phone_regex.match(re.sub(r'[\s\-\(\)]', '', value)):
        raise ValidationError(
            'Invalid phone number format. Use format: +1234567890 or (123) 456-7890'
        )


def validate_strong_password(value):
    """
    Validate password strength.
    Requirements:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    
    Args:
        value: Password string
        
    Raises:
        ValidationError: If password doesn't meet requirements
    """
    if len(value) < MIN_PASSWORD_LENGTH:
        raise ValidationError(
            f'Password must be at least {MIN_PASSWORD_LENGTH} characters long.'
        )
    
    if not re.search(r'[A-Z]', value):
        raise ValidationError(
            'Password must contain at least one uppercase letter.'
        )
    
    if not re.search(r'[a-z]', value):
        raise ValidationError(
            'Password must contain at least one lowercase letter.'
        )
    
    if not re.search(r'\d', value):
        raise ValidationError(
            'Password must contain at least one digit.'
        )
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
        raise ValidationError(
            'Password must contain at least one special character.'
        )


def validate_positive_number(value):
    """
    Validate that a number is positive.
    
    Args:
        value: Numeric value
        
    Raises:
        ValidationError: If value is not positive
    """
    if value <= 0:
        raise ValidationError('Value must be positive.')


def validate_price(value):
    """
    Validate price value.
    
    Args:
        value: Price value
        
    Raises:
        ValidationError: If price is invalid
    """
    if value < 0:
        raise ValidationError('Price cannot be negative.')
    
    if value > 999999.99:
        raise ValidationError('Price cannot exceed 999,999.99.')


def validate_stock_quantity(value):
    """
    Validate stock quantity.
    
    Args:
        value: Stock quantity value
        
    Raises:
        ValidationError: If stock quantity is invalid
    """
    if value < 0:
        raise ValidationError('Stock quantity cannot be negative.')
    
    if value > 999999:
        raise ValidationError('Stock quantity cannot exceed 999,999.')


# Predefined validators
phone_number_validator = RegexValidator(
    regex=r'^\+?1?\d{9,15}$',
    message='Enter a valid phone number.',
    code='invalid_phone_number'
)

email_validator = EmailValidator(
    message='Enter a valid email address.',
    code='invalid_email'
)
