"""
Test configuration for pytest.
"""

import os
import django
from django.conf import settings

# Configure Django settings for tests
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mobile_store.settings')
django.setup()


def pytest_configure(config):
    """Configure pytest settings."""
    settings.DEBUG = False
    settings.DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DB_NAME', 'test_db'),
            'USER': os.environ.get('DB_USER', 'postgres'),
            'PASSWORD': os.environ.get('DB_PASSWORD', 'postgres'),
            'HOST': os.environ.get('DB_HOST', 'localhost'),
            'PORT': os.environ.get('DB_PORT', '5432'),
        }
    }
