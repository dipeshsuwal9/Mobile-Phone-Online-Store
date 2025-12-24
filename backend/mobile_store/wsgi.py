"""
Production WSGI configuration with enhanced error handling and logging
"""

import os
import sys
from pathlib import Path

from django.core.wsgi import get_wsgi_application

# Add project directory to path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mobile_store.settings')

try:
    application = get_wsgi_application()
except Exception as e:
    # Log the error for debugging
    import logging
    logging.error(f"Failed to initialize WSGI application: {e}")
    raise
