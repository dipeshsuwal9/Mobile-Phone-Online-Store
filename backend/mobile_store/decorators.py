"""
Utility decorators for views.
"""

from functools import wraps
from django.core.cache import cache
from django.http import JsonResponse
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def cache_response(timeout=300):
    """
    Decorator to cache view responses.
    
    Args:
        timeout: Cache timeout in seconds (default: 300)
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Generate cache key
            cache_key = f"view_cache:{request.path}:{request.GET.urlencode()}"
            
            # Try to get from cache
            cached_response = cache.get(cache_key)
            if cached_response is not None:
                logger.debug(f"Cache hit for {cache_key}")
                return cached_response
            
            # Generate response
            response = view_func(request, *args, **kwargs)
            
            # Cache the response
            if response.status_code == 200:
                cache.set(cache_key, response, timeout)
                logger.debug(f"Cached response for {cache_key}")
            
            return response
        return wrapper
    return decorator


def require_api_key(view_func):
    """
    Decorator to require API key in header.
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        api_key = request.META.get('HTTP_X_API_KEY')
        
        # For development, you might want to skip this check
        # In production, validate against stored API keys
        if not api_key:
            return JsonResponse(
                {
                    'success': False,
                    'error': {
                        'message': 'API key required',
                        'code': status.HTTP_401_UNAUTHORIZED
                    }
                },
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        return view_func(request, *args, **kwargs)
    return wrapper


def log_execution_time(view_func):
    """
    Decorator to log view execution time.
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        import time
        start_time = time.time()
        
        response = view_func(request, *args, **kwargs)
        
        execution_time = time.time() - start_time
        logger.info(
            f"{view_func.__name__} executed in {execution_time:.2f}s "
            f"for {request.method} {request.path}"
        )
        
        return response
    return wrapper
