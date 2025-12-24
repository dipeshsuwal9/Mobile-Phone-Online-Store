"""
Health check view for monitoring and load balancers
"""
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.views.decorators.cache import never_cache
from django.db import connection
from django.core.cache import cache
import sys


@never_cache
@require_GET
def health_check(request):
    """
    Health check endpoint that verifies:
    - Database connectivity
    - Application is running
    - Python version
    """
    health_status = {
        'status': 'healthy',
        'python_version': sys.version,
        'checks': {}
    }
    
    # Database check
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        health_status['checks']['database'] = 'ok'
    except Exception as e:
        health_status['status'] = 'unhealthy'
        health_status['checks']['database'] = f'error: {str(e)}'
    
    # Application check
    health_status['checks']['application'] = 'ok'
    
    status_code = 200 if health_status['status'] == 'healthy' else 503
    return JsonResponse(health_status, status=status_code)


@never_cache
@require_GET
def ready_check(request):
    """
    Readiness check for Kubernetes/container orchestration
    """
    return JsonResponse({'status': 'ready'}, status=200)
