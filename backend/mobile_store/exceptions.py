"""
Custom exception handlers for the mobile_store project.
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import Http404
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler for DRF.
    
    Args:
        exc: The exception instance
        context: Context dictionary
        
    Returns:
        Response object with error details
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    # Log the exception
    logger.error(
        f'Exception in {context.get("view", "unknown view")}: {str(exc)}',
        exc_info=True,
        extra={'context': context}
    )
    
    if response is not None:
        # Customize error response format
        custom_response_data = {
            'success': False,
            'error': {
                'message': get_error_message(exc, response),
                'code': response.status_code,
                'details': response.data if isinstance(response.data, dict) else {'detail': response.data}
            }
        }
        response.data = custom_response_data
        return response
    
    # Handle Django ValidationError
    if isinstance(exc, DjangoValidationError):
        return Response(
            {
                'success': False,
                'error': {
                    'message': 'Validation error',
                    'code': status.HTTP_400_BAD_REQUEST,
                    'details': exc.message_dict if hasattr(exc, 'message_dict') else {'detail': exc.messages}
                }
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Handle 404 errors
    if isinstance(exc, Http404):
        return Response(
            {
                'success': False,
                'error': {
                    'message': 'Resource not found',
                    'code': status.HTTP_404_NOT_FOUND,
                    'details': {'detail': str(exc)}
                }
            },
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Handle other exceptions
    return Response(
        {
            'success': False,
            'error': {
                'message': 'An internal server error occurred',
                'code': status.HTTP_500_INTERNAL_SERVER_ERROR,
                'details': {'detail': str(exc) if str(exc) else 'Unknown error'}
            }
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )


def get_error_message(exc, response):
    """
    Get user-friendly error message from exception.
    
    Args:
        exc: Exception instance
        response: Response object
        
    Returns:
        User-friendly error message string
    """
    if response.status_code == status.HTTP_400_BAD_REQUEST:
        return 'Invalid request. Please check your input.'
    elif response.status_code == status.HTTP_401_UNAUTHORIZED:
        return 'Authentication required. Please log in.'
    elif response.status_code == status.HTTP_403_FORBIDDEN:
        return 'You do not have permission to perform this action.'
    elif response.status_code == status.HTTP_404_NOT_FOUND:
        return 'The requested resource was not found.'
    elif response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED:
        return 'This method is not allowed for this resource.'
    elif response.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
        return 'Too many requests. Please try again later.'
    elif response.status_code >= 500:
        return 'An internal server error occurred. Please try again later.'
    else:
        return str(exc) if str(exc) else 'An error occurred.'


class InsufficientStockException(Exception):
    """Raised when product stock is insufficient."""
    pass


class InvalidPaymentException(Exception):
    """Raised when payment information is invalid."""
    pass


class OrderNotFoundException(Exception):
    """Raised when order is not found."""
    pass


class CartEmptyException(Exception):
    """Raised when attempting to checkout with empty cart."""
    pass
