# 🏪 Mobile Store - Production-Ready E-Commerce Platform

A full-stack e-commerce platform for mobile phones and accessories built with Django REST Framework and React + TypeScript.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Development](#-development)
- [Production Deployment](#-production-deployment)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Backend (Django REST API)

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **Custom User Model** - Extended customer model with email authentication
- 📱 **Product Management** - Complete CRUD for phones and accessories
- 🛒 **Shopping Cart** - Session-based cart management
- 📦 **Order Processing** - Order creation and management
- 💳 **Payment Integration** - Payment tracking system
- 📊 **Admin Dashboard** - Django admin for management
- 📝 **API Documentation** - Auto-generated Swagger/ReDoc docs
- 🔒 **Security Hardened** - Production-ready security settings
- 🚫 **Cache Prevention** - Real-time data updates
- ❤️ **Health Checks** - Monitoring endpoints for uptime

### Frontend (React + TypeScript)

- ⚛️ **React 18** - Modern React with hooks
- 📘 **TypeScript** - Type-safe development
- 🎨 **Responsive Design** - Mobile-first approach
- 🔄 **Real-time Updates** - No caching issues
- 🛒 **Cart Management** - Add/remove products, quantity control
- 👤 **User Authentication** - Login, register, profile management
- 📦 **Order History** - View past orders and details
- 🔍 **Product Search** - Filter and search products
- 💳 **Checkout Flow** - Complete order placement

## 🛠 Tech Stack

### Backend

- **Framework:** Django 4.2.7
- **API:** Django REST Framework 3.14.0
- **Database:** PostgreSQL 14+
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Documentation:** drf-yasg (Swagger/OpenAPI)
- **CORS:** django-cors-headers
- **Image Processing:** Pillow
- **Server:** Gunicorn (production)
- **Static Files:** WhiteNoise

### Frontend

- **Framework:** React 18.2.0
- **Language:** TypeScript 5.9.3
- **Build Tool:** Vite 5.0.8
- **HTTP Client:** Axios 1.6.2
- **Routing:** React Router 6.20.0
- **Icons:** React Icons 4.12.0

### DevOps

- **Web Server:** Nginx (reverse proxy)
- **Process Manager:** systemd
- **Container:** Docker (optional)
- **CI/CD:** GitHub Actions (optional)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python:** 3.10 or higher
- **Node.js:** 18.x or higher
- **PostgreSQL:** 14.x or higher
- **pip:** Latest version
- **npm:** Latest version

### System Dependencies

**macOS:**

```bash
brew install python3 node postgresql
brew services start postgresql
```

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv nodejs npm postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**

- Download and install Python from [python.org](https://www.python.org/)
- Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/)

## 🚀 Quick Start

### Using Management Script (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd mobile-store

# Run setup (installs all dependencies)
./manage.sh setup

# Create database and run migrations
./manage.sh migrate

# Create admin user
./manage.sh createsuperuser

# Start backend (Terminal 1)
./manage.sh run-backend

# Start frontend (Terminal 2)
./manage.sh run-frontend
```

### Manual Setup

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Create logs directory
mkdir logs

# Start development server
python manage.py runserver
```

#### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
cp .env.example .env

# Start development server
npm run dev
```

## 📁 Project Structure

```
mobile-store/
├── backend/                    # Django backend
│   ├── accessories/           # Accessories app
│   ├── cart/                  # Shopping cart app
│   ├── customers/             # Custom user model
│   ├── orders/                # Order management
│   ├── payments/              # Payment processing
│   ├── phones/                # Phone products app
│   ├── mobile_store/          # Main project settings
│   │   ├── settings.py        # Base settings
│   │   ├── settings_production.py  # Production settings
│   │   ├── middleware.py      # Custom middleware
│   │   ├── health.py          # Health check endpoints
│   │   └── urls.py            # URL configuration
│   ├── media/                 # User uploads
│   ├── logs/                  # Application logs
│   ├── requirements.txt       # Python dependencies
│   ├── manage.py              # Django management
│   └── .env                   # Environment variables
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React context
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── public/                # Static assets
│   ├── package.json           # Node dependencies
│   ├── vite.config.ts         # Vite configuration
│   └── tsconfig.json          # TypeScript config
│
├── manage.sh                   # Management script
├── nginx.conf                  # Nginx configuration
├── DEPLOYMENT_CHECKLIST.md    # Deployment guide
└── README.md                   # This file
```

## ⚙️ Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Django Settings
SECRET_KEY=your-super-secret-key-min-50-chars
DEBUG=True  # Set to False in production
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=mobile_store_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5433

# JWT
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Mobile Store
VITE_APP_VERSION=1.0.0
```

## 💻 Development

### Backend Commands

```bash
# Run development server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Run checks
python manage.py check

# Run deployment checks
python manage.py check --deploy
```

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### API Endpoints

- **Backend:** http://localhost:8000
- **Admin Panel:** http://localhost:8000/admin/
- **API Docs (Swagger):** http://localhost:8000/swagger/
- **API Docs (ReDoc):** http://localhost:8000/redoc/
- **Health Check:** http://localhost:8000/health/
- **Frontend:** http://localhost:5173

## 🚢 Production Deployment

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for detailed deployment instructions.

### Quick Production Setup

1. **Configure Environment:**

   ```bash
   cp backend/.env.production.example backend/.env
   # Edit backend/.env with production values
   ```

2. **Generate Secret Key:**

   ```bash
   ./manage.sh generate-secret-key
   # Add to .env as SECRET_KEY
   ```

3. **Build Frontend:**

   ```bash
   ./manage.sh build-frontend
   ```

4. **Collect Static Files:**

   ```bash
   ./manage.sh collectstatic
   ```

5. **Use Production Settings:**

   ```bash
   export DJANGO_SETTINGS_MODULE=mobile_store.settings_production
   ```

6. **Start with Gunicorn:**

   ```bash
   gunicorn mobile_store.wsgi:application --bind 0.0.0.0:8000 --workers 3
   ```

7. **Configure Nginx:**
   - Copy `nginx.conf` to `/etc/nginx/sites-available/`
   - Update paths and domain
   - Enable site and reload Nginx

## 📚 API Documentation

### Authentication

```bash
# Register
POST /api/customers/register/
{
  "email": "user@example.com",
  "password": "securepass123",
  "name": "John Doe",
  "phone": "1234567890"
}

# Login
POST /api/customers/login/
{
  "email": "user@example.com",
  "password": "securepass123"
}

# Refresh Token
POST /api/customers/token/refresh/
{
  "refresh": "refresh_token_here"
}
```

### Products

```bash
# List Phones
GET /api/phones/

# Get Phone Details
GET /api/phones/{id}/

# List Accessories
GET /api/accessories/

# Search Products
GET /api/phones/?search=samsung
GET /api/accessories/?search=case
```

### Cart & Orders

```bash
# Get Cart
GET /api/cart/

# Add to Cart
POST /api/cart/add/
{
  "product_type": "PHONE",
  "product_id": 1,
  "quantity": 1
}

# Create Order
POST /api/orders/create/
```

For complete API documentation, visit:

- Swagger UI: http://localhost:8000/swagger/
- ReDoc: http://localhost:8000/redoc/

## 🧪 Testing

```bash
# Run all tests
./manage.sh test

# Run specific app tests
python manage.py test phones

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

## 🔧 Troubleshooting

### Backend Issues

**Database Connection Error:**

```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5433

# Check database exists
psql -U postgres -l
```

**Migration Issues:**

```bash
# Reset migrations (CAUTION: Development only)
python manage.py migrate --fake app_name zero
python manage.py migrate app_name
```

**Import Errors:**

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

**Build Errors:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API Connection Issues:**

- Check VITE_API_URL in .env
- Verify backend is running
- Check CORS settings

### Cache Issues

**Data Not Updating:**

- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
- Clear browser cache
- Check backend cache middleware is active
- Restart backend server

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **Python:** Follow PEP 8
- **TypeScript:** Follow project .eslintrc
- **Commits:** Use conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Django REST Framework team
- React team
- All contributors

## 📞 Support

For issues and questions:

- 📧 Email: support@mobilestore.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/mobile-store/issues)
- 📖 Docs: [Documentation](https://docs.mobilestore.com)

## 🗺️ Roadmap

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search and filters
- [ ] Redis caching
- [ ] Celery for async tasks
- [ ] Docker deployment
- [ ] CI/CD pipeline
- [ ] Mobile app

---

**Made with ❤️ by Your Team**
