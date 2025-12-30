"""
Custom middleware for the mobile_store project.
"""

import logging
import time
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)


class DisableCacheMiddleware:
    """
    Middleware to add comprehensive no-cache headers to all responses.
    This ensures that frontend always gets fresh data from the backend.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Only apply to API endpoints
        if request.path.startswith('/api/'):
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0, private'
            response['Pragma'] = 'no-cache'
            response['Expires'] = '0'
            
            # Remove ETag to prevent conditional requests
            if 'ETag' in response:
                del response['ETag']
            
            # Remove Last-Modified to prevent conditional requests
            if 'Last-Modified' in response:
                del response['Last-Modified']
        
        return response


class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Add comprehensive security headers to all responses.
    """
    
    def process_response(self, request, response):
        """
        Add security headers to response.
        
        Args:
            request: HTTP request object
            response: HTTP response object
            
        Returns:
            Modified response with security headers
        """
        # Content Security Policy
        response['Content-Security-Policy'] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self' http://localhost:* http://127.0.0.1:*; "
        )
        
        # X-Content-Type-Options
        response['X-Content-Type-Options'] = 'nosniff'
        
        # X-Frame-Options
        response['X-Frame-Options'] = 'DENY'
        
        # X-XSS-Protection
        response['X-XSS-Protection'] = '1; mode=block'
        
        # Referrer-Policy
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Permissions-Policy
        response['Permissions-Policy'] = (
            'geolocation=(), '
            'microphone=(), '
            'camera=(), '
            'payment=()'
        )
        
        return response


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Log all API requests for monitoring and debugging.
    """
    
    def process_request(self, request):
        """
        Log request details.
        
        Args:
            request: HTTP request object
        """
        request.start_time = time.time()
        
        if request.path.startswith('/api/'):
            logger.info(
                f'API Request: {request.method} {request.path} '
                f'from {self.get_client_ip(request)}'
            )
    
    def process_response(self, request, response):
        """
        Log response details and execution time.
        
        Args:
            request: HTTP request object
            response: HTTP response object
            
        Returns:
            Response object
        """
        if hasattr(request, 'start_time') and request.path.startswith('/api/'):
            execution_time = time.time() - request.start_time
            logger.info(
                f'API Response: {request.method} {request.path} '
                f'Status: {response.status_code} '
                f'Time: {execution_time:.2f}s'
            )
        
        return response
    
    @staticmethod
    def get_client_ip(request):
        """
        Get client IP address from request.
        
        Args:
            request: HTTP request object
            
        Returns:
            Client IP address string
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
