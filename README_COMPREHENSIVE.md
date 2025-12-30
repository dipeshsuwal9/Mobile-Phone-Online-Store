# Comprehensive README for Mobile Phone Online Store

## 📱 Mobile Phone Online Store

A full-stack e-commerce web application for browsing and purchasing mobile phones and accessories, built with Django REST Framework and React + TypeScript.

---

## 🚀 Features

### Customer Features

- Browse phones and accessories with advanced filtering
- Detailed product pages with specifications
- Shopping cart management
- Secure checkout process
- Order tracking and history
- User authentication and profile management

### Admin Features

- Product management (CRUD operations)
- Order management and status updates
- User management
- Inventory tracking
- Sales analytics

### Technical Features

- JWT-based authentication
- RESTful API design
- Rate limiting and throttling
- Comprehensive error handling
- Input validation and sanitization
- CORS configuration
- Security headers
- Responsive design
- Loading skeletons
- Toast notifications
- Error boundaries

---

## 🛠️ Technology Stack

### Backend

- **Framework:** Django 4.2.7
- **API:** Django REST Framework 3.14.0
- **Database:** PostgreSQL 15
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Image Processing:** Pillow
- **CORS:** django-cors-headers
- **Documentation:** drf-yasg (Swagger)
- **Server:** Gunicorn + Nginx

### Frontend

- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** CSS3

---

## 📋 Prerequisites

### Required Software

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

---

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dipeshsuwal9/Mobile-Phone-Online-Store.git
cd Mobile-Phone-Online-Store
```

### 2. Backend Setup

#### Windows

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

#### macOS/Linux

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Environment Variables

Create a `.env` file in the `backend` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=mobile_store_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Database Setup

```bash
# Create PostgreSQL database
createdb mobile_store_db

# Or using psql
psql -U postgres
CREATE DATABASE mobile_store_db;
\q

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data (optional)
python manage.py populate_sample_data
```

#### Start Backend Server

```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

#### Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000/api
```

#### Start Frontend Development Server

```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## 🧪 Running Tests

### Backend Tests

```bash
cd backend
pytest
pytest --cov  # With coverage report
```

### Frontend Tests

```bash
cd frontend
npm test
npm run type-check  # TypeScript check
```

---

## 📦 Production Deployment

### Backend Production Setup

1. **Update settings:**

```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']
```

2. **Collect static files:**

```bash
python manage.py collectstatic --noinput
```

3. **Use Gunicorn:**

```bash
gunicorn mobile_store.wsgi:application --bind 0.0.0.0:8000
```

4. **Configure Nginx** (see `nginx.conf` for example)

### Frontend Production Build

```bash
cd frontend
npm run build
```

The `dist` folder contains the production build.

---

## 📚 API Documentation

Interactive API documentation is available at:

- **Swagger UI:** `http://localhost:8000/swagger/`
- **ReDoc:** `http://localhost:8000/redoc/`
- **API Guide:** See [API.md](API.md) for detailed documentation

---

## 🔐 Security Features

- JWT token authentication
- Password hashing with Django's built-in system
- CSRF protection
- XSS protection
- SQL injection prevention
- Rate limiting on API endpoints
- Input validation and sanitization
- Security headers (CSP, X-Frame-Options, etc.)
- HTTPS in production

---

## 🗂️ Project Structure

```
Mobile-Phone-Online-Store/
├── backend/
│   ├── mobile_store/         # Main Django project
│   │   ├── settings.py       # Configuration
│   │   ├── urls.py          # URL routing
│   │   ├── middleware.py    # Custom middleware
│   │   ├── exceptions.py    # Error handlers
│   │   ├── validators.py    # Input validators
│   │   └── constants.py     # App constants
│   ├── phones/              # Phones app
│   ├── accessories/         # Accessories app
│   ├── customers/           # Users app
│   ├── cart/               # Shopping cart
│   ├── orders/             # Order management
│   ├── payments/           # Payment processing
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Coding Standards

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints where applicable
- Write docstrings for all functions/classes
- Maximum line length: 100 characters

### TypeScript (Frontend)

- Follow ESLint configuration
- Use TypeScript strict mode
- Prefer functional components with hooks
- Write JSDoc comments for complex functions

---

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error:**

```bash
# Check PostgreSQL is running
sudo service postgresql status  # Linux
brew services list              # macOS

# Verify credentials in .env file
```

**Migration Errors:**

```bash
# Reset migrations (development only!)
python manage.py migrate <app_name> zero
python manage.py migrate
```

### Frontend Issues

**Module Not Found:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build Errors:**

```bash
# Check TypeScript errors
npm run type-check
```

---

## 📞 Support & Contact

- **GitHub Issues:** [Report a bug](https://github.com/dipeshsuwal9/Mobile-Phone-Online-Store/issues)
- **Email:** dipeshsuwal9@gmail.com

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Django and Django REST Framework communities
- React and TypeScript communities
- All contributors and testers

---

## 🔄 Changelog

### Version 2.0.0 (Latest)

- ✅ Implemented comprehensive error handling
- ✅ Added TypeScript strict mode
- ✅ Implemented rate limiting
- ✅ Added input validation and sanitization
- ✅ Created test suite for backend and frontend
- ✅ Added CI/CD pipeline
- ✅ Improved security headers and middleware
- ✅ Added toast notifications and error boundaries
- ✅ Implemented loading skeletons
- ✅ Added API documentation
- ✅ Performance optimizations
- ✅ Accessibility improvements

### Version 1.0.0

- Initial release with core features

---

## 🎯 Roadmap

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search with Elasticsearch
- [ ] Real-time inventory updates
- [ ] Mobile app (React Native)
- [ ] Admin analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode

---

**Made with ❤️ by Dipesh Suwal**
