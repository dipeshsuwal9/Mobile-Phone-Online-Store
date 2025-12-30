"""
Custom management command to check system health.
"""

from django.core.management.base import BaseCommand
from django.db import connection
from django.core.cache import cache
import sys


class Command(BaseCommand):
    help = 'Check system health and dependencies'

    def handle(self, *args, **options):
        """Execute the health check."""
        self.stdout.write(self.style.SUCCESS('=== System Health Check ===\n'))
        
        all_checks_passed = True
        
        # Check database connection
        all_checks_passed &= self.check_database()
        
        # Check cache
        all_checks_passed &= self.check_cache()
        
        # Check media directory
        all_checks_passed &= self.check_media()
        
        # Check static files
        all_checks_passed &= self.check_static()
        
        # Summary
        self.stdout.write('\n' + '='*50)
        if all_checks_passed:
            self.stdout.write(self.style.SUCCESS('✓ All health checks passed!'))
            sys.exit(0)
        else:
            self.stdout.write(self.style.ERROR('✗ Some health checks failed!'))
            sys.exit(1)
    
    def check_database(self):
        """Check database connection."""
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT 1')
            self.stdout.write(self.style.SUCCESS('✓ Database: Connected'))
            return True
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Database: Failed - {str(e)}'))
            return False
    
    def check_cache(self):
        """Check cache system."""
        try:
            cache.set('health_check', 'ok', 10)
            value = cache.get('health_check')
            if value == 'ok':
                self.stdout.write(self.style.SUCCESS('✓ Cache: Working'))
                return True
            else:
                self.stdout.write(self.style.WARNING('⚠ Cache: Not working properly'))
                return False
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'⚠ Cache: Failed - {str(e)}'))
            return False
    
    def check_media(self):
        """Check media directory."""
        from django.conf import settings
        import os
        
        media_root = settings.MEDIA_ROOT
        if os.path.exists(media_root) and os.path.isdir(media_root):
            self.stdout.write(self.style.SUCCESS(f'✓ Media: {media_root}'))
            return True
        else:
            self.stdout.write(self.style.WARNING(f'⚠ Media: Directory not found - {media_root}'))
            return False
    
    def check_static(self):
        """Check static files directory."""
        from django.conf import settings
        import os
        
        static_root = settings.STATIC_ROOT
        if os.path.exists(static_root) and os.path.isdir(static_root):
            self.stdout.write(self.style.SUCCESS(f'✓ Static: {static_root}'))
            return True
        else:
            self.stdout.write(self.style.WARNING(f'⚠ Static: Directory not found - {static_root}'))
            return False
