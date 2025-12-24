#!/usr/bin/env python3
"""
Temporary script to create a Django superuser using SQLite database.
This bypasses the PostgreSQL requirement.
"""
import os
import sys
import django
from pathlib import Path

# Add the project directory to the Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# Set the settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mobile_store.settings')

# Override database settings to use SQLite temporarily
from django.conf import settings
settings.DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'temp_db.sqlite3',
    }
}

# Setup Django
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("Create Django Admin Superuser")
print("=" * 60)
print("\nNote: This creates a user in a temporary SQLite database.")
print("You'll need to create the same user in PostgreSQL later.\n")

username = input("Enter username: ")
email = input("Enter email address: ")
password = input("Enter password: ")
password_confirm = input("Confirm password: ")

if password != password_confirm:
    print("\nError: Passwords don't match!")
    sys.exit(1)

try:
    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    print(f"\n✓ Superuser '{username}' created successfully!")
    print(f"\nCredentials to remember:")
    print(f"Username: {username}")
    print(f"Password: {password}")
    print(f"\nImportant: When PostgreSQL is set up, create this user there too.")
except Exception as e:
    print(f"\n✗ Error creating superuser: {e}")
    sys.exit(1)
