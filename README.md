# Mobile Phone Store Management System

A full-stack e-commerce web application for managing a mobile phone store, built with Django REST Framework backend and React (Vite) frontend.

## 🚀 Features

### Backend (Django REST Framework)

- **Mobile Phones Management**: Complete CRUD operations for phones with specifications
- **Brands Management**: Manage phone brands with country information
- **Accessories**: Separate inventory management for phone accessories
- **User Authentication**: JWT-based authentication with registration and login
- **Shopping Cart**: User-specific cart with add, update, remove functionality
- **Order Management**: Create orders from cart, track order status
- **Payment Integration**: Record and track payments for orders
- **Admin Panel**: Full Django admin interface for store management

### Frontend (React + Vite)

- **Responsive UI**: Mobile-first design that works on all devices
- **User Authentication**: Login, registration, and profile management
- **Product Catalog**: Browse phones and accessories with filtering and search
- **Product Details**: Detailed view with specifications and pricing
- **Shopping Cart**: Real-time cart updates with quantity management
- **Checkout Process**: Secure checkout with address and payment selection
- **Order Tracking**: View order history and details
- **Protected Routes**: Route guards for authenticated users

## 📁 Project Structure

```
project4/
├── backend/                    # Django Backend
│   ├── mobile_store/          # Main project settings
│   │   ├── settings.py        # Django settings with JWT, CORS, DB config
│   │   ├── urls.py            # Main URL routing
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── phones/                # Phones & Brands app
│   │   ├── models.py          # Brand, MobilePhone models
│   │   ├── serializers.py     # DRF serializers
│   │   ├── views.py           # ViewSets for CRUD
│   │   ├── urls.py            # API endpoints
│   │   └── admin.py           # Admin configuration
│   ├── accessories/           # Accessories app
│   │   ├── models.py          # Accessory model
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── customers/             # Customer authentication app
│   │   ├── models.py          # Custom User model
│   │   ├── serializers.py     # Registration, login serializers
│   │   ├── views.py           # Auth views with JWT
│   │   ├── urls.py
│   │   └── admin.py
│   ├── cart/                  # Shopping cart app
│   │   ├── models.py          # Cart, CartItem models
│   │   ├── serializers.py
│   │   ├── views.py           # Cart operations
│   │   ├── urls.py
│   │   └── admin.py
│   ├── orders/                # Order management app
│   │   ├── models.py          # Order, OrderItem models
│   │   ├── serializers.py
│   │   ├── views.py           # Order creation, tracking
│   │   ├── urls.py
│   │   └── admin.py
│   ├── payments/              # Payment tracking app
│   │   ├── models.py          # Payment model
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── manage.py
│   ├── requirements.txt       # Python dependencies
│   └── .env.example          # Environment variables template
│
└── frontend/                  # React Frontend
    ├── src/
    │   ├── components/        # Reusable components
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/             # Page components
    │   │   ├── Home.jsx
    │   │   ├── PhoneCatalog.jsx
    │   │   ├── PhoneDetail.jsx
    │   │   ├── Accessories.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Orders.jsx
    │   │   └── OrderDetail.jsx
    │   ├── services/          # API integration
    │   │   ├── api.js         # Axios instance with interceptors
    │   │   ├── authService.js
    │   │   ├── phoneService.js
    │   │   ├── accessoryService.js
    │   │   ├── cartService.js
    │   │   ├── orderService.js
    │   │   └── paymentService.js
    │   ├── context/           # React Context
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── App.jsx            # Main app component
    │   ├── main.jsx           # Entry point
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    └── index.html
```

## 🛠️ Installation & Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   # or
   venv\Scripts\activate  # On Windows
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up PostgreSQL database**

   ```sql
   CREATE DATABASE mobile_store_db;
   CREATE USER postgres WITH PASSWORD 'your-password';
   GRANT ALL PRIVILEGES ON DATABASE mobile_store_db TO postgres;
   ```

5. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env file with your database credentials
   ```

   Example `.env`:

   ```
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   DB_NAME=mobile_store_db
   DB_USER=postgres
   DB_PASSWORD=your-password
   DB_HOST=localhost
   DB_PORT=5433
   JWT_ACCESS_TOKEN_LIFETIME=60
   JWT_REFRESH_TOKEN_LIFETIME=1440
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   ```

6. **Run migrations**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser**

   ```bash
   python manage.py createsuperuser
   ```

8. **Run development server**

   ```bash
   python manage.py runserver
   ```

   Backend will be available at: `http://localhost:8000`

   - API: `http://localhost:8000/api/`
   - Admin: `http://localhost:8000/admin/`
   - Swagger Docs: `http://localhost:8000/swagger/`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

   Frontend will be available at: `http://localhost:5173`

## 📡 API Endpoints

### Authentication

- `POST /api/customers/register/` - Register new customer
- `POST /api/customers/login/` - Login (returns JWT tokens)
- `POST /api/customers/token/refresh/` - Refresh access token
- `GET /api/customers/profiles/me/` - Get current user profile
- `PUT /api/customers/profiles/update_profile/` - Update profile
- `POST /api/customers/profiles/change_password/` - Change password

### Phones & Brands

- `GET /api/phones/` - List all phones (with filtering, search)
- `GET /api/phones/{id}/` - Get phone details
- `POST /api/phones/` - Create phone (admin only)
- `PUT /api/phones/{id}/` - Update phone (admin only)
- `DELETE /api/phones/{id}/` - Delete phone (admin only)
- `GET /api/phones/brands/` - List all brands
- `GET /api/phones/brands/{id}/` - Get brand details
- `POST /api/phones/brands/` - Create brand (admin only)

### Accessories

- `GET /api/accessories/` - List all accessories
- `GET /api/accessories/{id}/` - Get accessory details
- `POST /api/accessories/` - Create accessory (admin only)
- `PUT /api/accessories/{id}/` - Update accessory (admin only)
- `DELETE /api/accessories/{id}/` - Delete accessory (admin only)

### Cart

- `GET /api/cart/my_cart/` - Get current user's cart
- `POST /api/cart/add_item/` - Add item to cart
- `PATCH /api/cart/update_item/` - Update item quantity
- `DELETE /api/cart/remove_item/` - Remove item from cart
- `DELETE /api/cart/clear_cart/` - Clear entire cart

### Orders

- `GET /api/orders/my_orders/` - Get user's orders
- `GET /api/orders/{id}/` - Get order details
- `POST /api/orders/create_from_cart/` - Create order from cart
- `POST /api/orders/{id}/cancel/` - Cancel order
- `PATCH /api/orders/{id}/update_status/` - Update status (admin only)

### Payments

- `GET /api/payments/my_payments/` - Get user's payments
- `POST /api/payments/create_payment/` - Create payment for order
- `GET /api/payments/{id}/` - Get payment details
- `PATCH /api/payments/{id}/update_status/` - Update status (admin only)

## 🗄️ Database Schema

### Models Overview

**Customer (Custom User)**

- customer_id (PK)
- name, email (unique), phone, address
- password (hashed)
- is_active, is_staff, is_superuser

**Brand**

- brand_id (PK)
- brand_name (unique)
- country_of_origin

**MobilePhone**

- phone_id (PK)
- brand (FK to Brand)
- model_name, price, stock_quantity
- ram, storage, battery_capacity, processor, os
- description, image_url

**Accessory**

- accessory_id (PK)
- name, category, price, stock_quantity
- description, image_url

**Cart**

- cart_id (PK)
- customer (OneToOne with Customer)

**CartItem**

- cart_item_id (PK)
- cart (FK to Cart)
- product_type (PHONE/ACCESSORY)
- product_id, quantity

**Order**

- order_id (PK)
- customer (FK to Customer)
- order_date, status, total_amount
- shipping_address, notes

**OrderItem**

- order_item_id (PK)
- order (FK to Order)
- product_type, product_id, product_name
- quantity, price_at_purchase

**Payment**

- payment_id (PK)
- order (FK to Order)
- amount, payment_method, payment_date
- status, transaction_id

## 🔐 Authentication Flow

1. **Registration**: User registers with email, name, phone, password
2. **Login**: User logs in → receives access & refresh JWT tokens
3. **Token Storage**: Frontend stores tokens in localStorage
4. **API Requests**: Access token sent in Authorization header
5. **Token Refresh**: Automatic refresh when access token expires
6. **Logout**: Tokens removed from localStorage

## 🎨 Frontend Features

### Context Providers

- **AuthContext**: Manages user authentication state
- **CartContext**: Manages shopping cart state and operations

### Protected Routes

- Cart, Checkout, Orders pages require authentication
- Automatic redirect to login if not authenticated

### API Integration

- Axios instance with request/response interceptors
- Automatic token attachment to requests
- Automatic token refresh on 401 errors
- Clean service layer for all API calls

## 🚦 Running in Production

### Backend

```bash
# Set DEBUG=False in .env
# Configure allowed hosts
# Collect static files
python manage.py collectstatic

# Use gunicorn or similar
gunicorn mobile_store.wsgi:application
```

### Frontend

```bash
# Build for production
npm run build

# Serve dist folder with nginx or similar
```

## 🧪 Testing

### Backend

```bash
python manage.py test
```

### Frontend

```bash
npm run test
```

## 📝 Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/`

Features:

- Manage all models (Phones, Brands, Accessories, Orders, etc.)
- View and edit customer information
- Track orders and payments
- Update inventory and stock levels

## 🔧 Environment Variables

### Backend (.env)

- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `DB_NAME`: PostgreSQL database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `JWT_ACCESS_TOKEN_LIFETIME`: Access token lifetime (minutes)
- `JWT_REFRESH_TOKEN_LIFETIME`: Refresh token lifetime (minutes)
- `CORS_ALLOWED_ORIGINS`: Allowed frontend origins

## 📚 Technologies Used

### Backend

- Django 4.2
- Django REST Framework 3.14
- Django REST Framework SimpleJWT 5.3
- PostgreSQL (psycopg2-binary)
- Django CORS Headers
- drf-yasg (Swagger documentation)

### Frontend

- React 18
- Vite 5
- React Router DOM 6
- Axios 1.6
- React Icons

## 👥 User Roles

### Customer

- Browse phones and accessories
- Add items to cart
- Place orders
- View order history
- Manage profile

### Admin (Staff)

- All customer permissions
- Add/edit/delete products
- Manage orders and inventory
- Update order status
- Access admin panel

## 🎯 Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Product reviews and ratings
- Wishlist functionality
- Email notifications for orders
- Advanced search with Elasticsearch
- Product recommendations
- Inventory alerts
- Sales analytics dashboard

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For any queries or support, please contact the development team.

---

Built with ❤️ using Django REST Framework and React
