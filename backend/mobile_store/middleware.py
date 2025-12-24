"""
Custom middleware to disable all caching for API responses
"""


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
