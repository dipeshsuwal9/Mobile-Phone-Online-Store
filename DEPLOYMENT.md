# Deployment Guide

## 🚀 Production Deployment

### Prerequisites

- Ubuntu 20.04+ server
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)

## Backend Deployment (Django)

### Option 1: Deploy with Gunicorn + Nginx

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python, PostgreSQL, Nginx
sudo apt install python3-pip python3-venv postgresql postgresql-contrib nginx -y
```

#### 2. PostgreSQL Setup

```bash
# Create database and user
sudo -u postgres psql

CREATE DATABASE mobile_store_db;
CREATE USER mobile_store_user WITH PASSWORD 'your-strong-password';
ALTER ROLE mobile_store_user SET client_encoding TO 'utf8';
ALTER ROLE mobile_store_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE mobile_store_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE mobile_store_db TO mobile_store_user;
\q
```

#### 3. Application Setup

```bash
# Create app directory
sudo mkdir -p /var/www/mobile-store
cd /var/www/mobile-store

# Clone or upload your code
git clone your-repo-url backend
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn

# Create production .env
sudo nano .env
```

**.env (Production)**

```env
SECRET_KEY=your-super-secret-key-here-change-this
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,server-ip

DB_NAME=mobile_store_db
DB_USER=mobile_store_user
DB_PASSWORD=your-strong-password
DB_HOST=localhost
DB_PORT=5432

JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

#### 4. Django Setup

```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Test Gunicorn
gunicorn mobile_store.wsgi:application --bind 0.0.0.0:8000
```

#### 5. Gunicorn Service

```bash
sudo nano /etc/systemd/system/mobile-store.service
```

```ini
[Unit]
Description=Mobile Store Gunicorn daemon
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/mobile-store/backend
Environment="PATH=/var/www/mobile-store/backend/venv/bin"
ExecStart=/var/www/mobile-store/backend/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:/var/www/mobile-store/backend/mobile_store.sock \
          mobile_store.wsgi:application

[Install]
WantedBy=multi-user.target
```

```bash
# Start and enable service
sudo systemctl start mobile-store
sudo systemctl enable mobile-store
sudo systemctl status mobile-store
```

#### 6. Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/mobile-store
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location = /favicon.ico { access_log off; log_not_found off; }

    location /static/ {
        alias /var/www/mobile-store/backend/staticfiles/;
    }

    location /media/ {
        alias /var/www/mobile-store/backend/media/;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/var/www/mobile-store/backend/mobile_store.sock;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/mobile-store /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 7. SSL Setup (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Option 2: Deploy with Docker

#### Dockerfile (Backend)

```dockerfile
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "mobile_store.wsgi:application", "--bind", "0.0.0.0:8000"]
```

#### docker-compose.yml

```yaml
version: "3.8"

services:
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: mobile_store_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your-password

  backend:
    build: ./backend
    command: gunicorn mobile_store.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./backend:/app
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    depends_on:
      - db

  nginx:
    image: nginx:latest
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend

volumes:
  postgres_data:
  static_volume:
  media_volume:
```

```bash
# Deploy with Docker
docker-compose up -d
```

## Frontend Deployment (React)

### Option 1: Deploy with Nginx

#### 1. Build Frontend

```bash
cd frontend
npm install
npm run build
```

#### 2. Upload dist folder to server

```bash
# On server
sudo mkdir -p /var/www/mobile-store/frontend
# Upload dist folder contents to /var/www/mobile-store/frontend
```

#### 3. Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/mobile-store-frontend
```

```nginx
server {
    listen 80;
    server_name frontend.your-domain.com;

    root /var/www/mobile-store/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/mobile-store-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Option 2: Deploy to Vercel

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 3: Deploy to Netlify

```bash
cd frontend
npm run build

# Upload dist folder to Netlify
# Or connect GitHub repo for auto-deployment
```

### Option 4: Deploy with Docker

#### Dockerfile (Frontend)

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf (for Docker)

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Platform-as-a-Service Options

### Backend

#### Heroku

```bash
# Create Procfile
echo "web: gunicorn mobile_store.wsgi" > Procfile

# Create runtime.txt
echo "python-3.11.0" > runtime.txt

# Deploy
heroku create mobile-store-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

#### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### DigitalOcean App Platform

- Connect GitHub repository
- Configure build settings
- Add PostgreSQL database
- Deploy

### Frontend

#### Vercel (Recommended for React)

- Connect GitHub repository
- Auto-detects Vite
- Automatic deployments

#### Netlify

- Drag & drop dist folder
- Or connect GitHub repo
- Configure redirects for SPA

#### Cloudflare Pages

- Connect GitHub repository
- Build command: `npm run build`
- Publish directory: `dist`

## Environment Variables Setup

### Backend (.env)

```env
# Production settings
DEBUG=False
SECRET_KEY=generate-new-secret-key
ALLOWED_HOSTS=api.your-domain.com

# Database (use hosted PostgreSQL)
DB_NAME=mobile_store_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=db-host.provider.com
DB_PORT=5432

# CORS (update with frontend URL)
CORS_ALLOWED_ORIGINS=https://your-frontend.com
```

### Frontend (Environment Variables)

```env
VITE_API_URL=https://api.your-domain.com
```

Update in `frontend/src/services/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
```

## Post-Deployment Checklist

### Security

- [ ] Change SECRET_KEY
- [ ] Set DEBUG=False
- [ ] Configure ALLOWED_HOSTS
- [ ] Setup SSL/HTTPS
- [ ] Enable CSRF protection
- [ ] Configure CORS properly
- [ ] Use environment variables
- [ ] Setup database backups

### Performance

- [ ] Enable gzip compression
- [ ] Configure CDN for static files
- [ ] Setup Redis for caching (optional)
- [ ] Optimize database queries
- [ ] Enable browser caching
- [ ] Minify frontend assets

### Monitoring

- [ ] Setup error tracking (Sentry)
- [ ] Configure logging
- [ ] Setup uptime monitoring
- [ ] Enable analytics
- [ ] Database monitoring

### Backups

- [ ] Database daily backups
- [ ] Media files backup
- [ ] Configuration backups
- [ ] Code repository backups

## Maintenance

### Update Application

```bash
# Backend
cd /var/www/mobile-store/backend
source venv/bin/activate
git pull
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart mobile-store

# Frontend
cd /var/www/mobile-store/frontend
git pull
npm install
npm run build
```

### Database Backup

```bash
# Backup
pg_dump -U mobile_store_user mobile_store_db > backup_$(date +%Y%m%d).sql

# Restore
psql -U mobile_store_user mobile_store_db < backup_20241203.sql
```

### View Logs

```bash
# Gunicorn logs
sudo journalctl -u mobile-store -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Scaling

### Horizontal Scaling

- Use load balancer (Nginx, HAProxy)
- Multiple Gunicorn workers
- Database replication
- Redis for session management

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Use connection pooling
- Enable query caching

## Recommended Hosting Providers

### Backend

- **DigitalOcean** ($5-20/month)
- **AWS EC2** (Free tier available)
- **Heroku** (Free tier, easy deployment)
- **Railway** ($5/month)
- **Render** (Free tier)

### Frontend

- **Vercel** (Free for personal projects)
- **Netlify** (Free tier)
- **Cloudflare Pages** (Free)
- **GitHub Pages** (Free, static only)

### Database

- **AWS RDS** (Free tier)
- **DigitalOcean Managed PostgreSQL** ($15/month)
- **ElephantSQL** (Free tier)
- **Supabase** (Free tier)

## Support & Troubleshooting

### Common Issues

**502 Bad Gateway**

- Check Gunicorn service status
- Verify socket file permissions
- Check Nginx configuration

**Database Connection Error**

- Verify PostgreSQL is running
- Check database credentials
- Ensure database exists

**Static Files Not Loading**

- Run collectstatic
- Check Nginx static file path
- Verify file permissions

**CORS Errors**

- Update CORS_ALLOWED_ORIGINS
- Check frontend API URL
- Verify Access-Control headers

---

For detailed help, refer to:

- Django Deployment: https://docs.djangoproject.com/en/4.2/howto/deployment/
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html
