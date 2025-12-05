# Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Setup Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start backend server
python manage.py runserver
```

Backend runs at: http://localhost:8000

### Step 2: Setup Frontend

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

Frontend runs at: http://localhost:5173

### Step 3: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/
- **API Docs**: http://localhost:8000/swagger/

## 📝 Test Accounts

After creating superuser, you can:

1. Login to admin panel with superuser credentials
2. Add sample phones, brands, and accessories
3. Register a customer account on the frontend
4. Test the shopping flow

## 🎯 Testing the Application

### 1. Admin Tasks (http://localhost:8000/admin/)

- Login with superuser credentials
- Add brands (e.g., Apple, Samsung, Google)
- Add phones with specifications
- Add accessories (cases, chargers, etc.)

### 2. Customer Flow (http://localhost:5173)

- Register a new account
- Browse phones and accessories
- Add items to cart
- Complete checkout
- View orders

## 🔧 Common Issues

### Database Connection Error

- Ensure PostgreSQL is running
- Check credentials in `.env` file
- Create database: `CREATE DATABASE mobile_store_db;`

### CORS Error

- Ensure backend is running on port 8000
- Ensure frontend is running on port 5173
- Check CORS_ALLOWED_ORIGINS in settings.py

### Token Errors

- Clear localStorage in browser
- Re-login to get fresh tokens

## 📊 Sample Data

Create sample data via Django admin or shell:

```python
python manage.py shell

from phones.models import Brand, MobilePhone

# Create a brand
apple = Brand.objects.create(
    brand_name="Apple",
    country_of_origin="USA"
)

# Create a phone
iphone = MobilePhone.objects.create(
    brand=apple,
    model_name="iPhone 15 Pro",
    price=129900.00,
    stock_quantity=50,
    ram="8GB",
    storage="256GB",
    battery_capacity="3274mAh",
    processor="A17 Pro",
    os="iOS",
    description="Latest iPhone with titanium design"
)
```

## 🎨 Default Features Enabled

✅ User Registration & Login (JWT)
✅ Product Browsing & Search
✅ Shopping Cart Management
✅ Order Placement
✅ Payment Recording
✅ Order Tracking
✅ Admin Panel
✅ API Documentation (Swagger)
✅ Responsive Design

## 📱 Next Steps

1. Add product images (update image_url fields)
2. Customize styling in CSS files
3. Add more product categories
4. Integrate payment gateway
5. Set up email notifications
6. Deploy to production

Enjoy building your Mobile Store! 🎉
