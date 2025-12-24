# Deployment Checklist for Mobile Store Application

## Pre-Deployment Steps

### 1. Environment Setup

- [ ] Copy `.env.production.example` to `.env`
- [ ] Update `SECRET_KEY` with a strong random key (min 50 characters)
- [ ] Set `DEBUG=False`
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Update database credentials
- [ ] Configure CORS_ALLOWED_ORIGINS with your frontend URL

### 2. Database

- [ ] Create PostgreSQL database
- [ ] Run migrations: `python manage.py migrate`
- [ ] Create superuser: `python manage.py createsuperuser`
- [ ] Load initial data (if any): `python manage.py loaddata fixtures/*.json`

### 3. Static Files

- [ ] Collect static files: `python manage.py collectstatic --noinput`
- [ ] Configure media file storage (local or S3)
- [ ] Set proper permissions for media folder

### 4. Security

- [ ] Generate new SECRET_KEY for production
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Review CORS settings
- [ ] Configure rate limiting (optional)

### 5. Frontend Build

- [ ] Update API URL in frontend environment variables
- [ ] Run: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Configure production web server (Nginx/Apache)

### 6. Backend Deployment

- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Configure Gunicorn/uWSGI
- [ ] Set up systemd service or supervisor
- [ ] Configure reverse proxy (Nginx)

### 7. Monitoring & Logging

- [ ] Set up error logging (Sentry, etc.)
- [ ] Configure log rotation
- [ ] Set up monitoring (New Relic, DataDog, etc.)
- [ ] Configure health check endpoints

### 8. Testing

- [ ] Run Django checks: `python manage.py check --deploy`
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test file uploads
- [ ] Test payment processing (if applicable)
- [ ] Load testing

### 9. Documentation

- [ ] Update API documentation
- [ ] Document deployment process
- [ ] Create backup/restore procedures
- [ ] Document monitoring setup

## Production Commands

### Django

```bash
# Check deployment settings
python manage.py check --deploy

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### Gunicorn

```bash
# Start Gunicorn
gunicorn mobile_store.wsgi:application --bind 0.0.0.0:8000 --workers 3

# With systemd
sudo systemctl start mobile_store
sudo systemctl enable mobile_store
```

### Frontend

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables Summary

### Required

- SECRET_KEY
- DEBUG (False in production)
- ALLOWED_HOSTS
- DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
- CORS_ALLOWED_ORIGINS

### Optional

- JWT_ACCESS_TOKEN_LIFETIME
- JWT_REFRESH_TOKEN_LIFETIME
- EMAIL\_\* (for email functionality)
- AWS\_\* (for S3 storage)

## Post-Deployment

- [ ] Monitor error logs for 24-48 hours
- [ ] Set up automatic backups
- [ ] Configure SSL certificate auto-renewal
- [ ] Document incident response procedures
- [ ] Set up uptime monitoring

## Rollback Plan

1. Keep previous version backed up
2. Document rollback procedure
3. Test rollback in staging environment
4. Have database backup strategy

## Performance Optimization

- [ ] Enable database connection pooling
- [ ] Configure Redis for caching (optional)
- [ ] Enable Gzip compression
- [ ] Optimize images and static files
- [ ] Configure CDN (optional)

## Security Hardening

- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Configure HTTPS only
- [ ] Set up fail2ban
- [ ] Enable database encryption at rest
- [ ] Regular penetration testing
