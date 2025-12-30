# QUICK START GUIDE - Code Improvements

## 🚀 Getting Started with the Improved Codebase

### Step 1: Update Dependencies

#### Backend

```bash
cd backend
pip install -r requirements.txt
pip install -r requirements-dev.txt  # For development
```

#### Frontend

```bash
cd frontend
npm install
```

---

### Step 2: Configure Environment

Create `.env` file in the `backend` directory:

```env
# Copy from .env.example
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
DB_NAME=mobile_store_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

**⚠️ IMPORTANT:** Never use the default SECRET_KEY in production!

---

### Step 3: Run Migrations

```bash
cd backend
python manage.py migrate
python manage.py createsuperuser
```

---

### Step 4: Health Check

Run the new health check command:

```bash
python manage.py health_check
```

This checks:

- ✅ Database connection
- ✅ Cache system
- ✅ Media directory
- ✅ Static files

---

### Step 5: Run Tests

#### Backend Tests

```bash
cd backend
pytest                    # Run all tests
pytest --cov             # With coverage
pytest phones/tests.py   # Specific app
```

#### Frontend Type Check

```bash
cd frontend
npm run type-check
```

---

### Step 6: Start Development Servers

#### Terminal 1 - Backend

```bash
cd backend
python manage.py runserver
```

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

---

## 🔍 New Features You Can Use

### 1. Error Handling (Frontend)

```typescript
import { handleApiError } from "./utils/errorHandler";

try {
  const data = await api.get("/phones/");
} catch (error) {
  const message = handleApiError(error);
  // Show error to user
}
```

### 2. Toast Notifications

```typescript
import { useToast } from "./components/Toast";

function MyComponent() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast("Order placed successfully!", "success");
  };
}
```

### 3. Form Validation

```typescript
import { validateForm, commonValidationRules } from "./utils/validation";

const errors = validateForm(formData, {
  email: commonValidationRules.email,
  password: commonValidationRules.strongPassword,
});
```

### 4. Confirmation Dialogs

```typescript
import { useConfirmDialog } from "./components/ConfirmDialog";

function MyComponent() {
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  const handleDelete = () => {
    showConfirm(
      "Delete Item",
      "Are you sure you want to delete this item?",
      async () => {
        // Delete logic here
      },
      "danger"
    );
  };

  return (
    <>
      <button onClick={handleDelete}>Delete</button>
      {ConfirmDialog}
    </>
  );
}
```

### 5. Loading States

```typescript
import { LoadingSkeleton } from "./components/LoadingSkeleton";

function MyComponent() {
  if (loading) {
    return <LoadingSkeleton height="200px" />;
  }
  // ... rest of component
}
```

### 6. Empty States

```typescript
import EmptyState from "./components/EmptyState";

function MyComponent() {
  if (items.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="No items found"
        description="Start shopping to see items here"
        action={{
          label: "Browse Products",
          onClick: () => navigate("/phones"),
        }}
      />
    );
  }
}
```

---

## 🔒 Security Best Practices

### 1. Never Commit Secrets

```bash
# .env file is in .gitignore
# Always use .env.example as template
```

### 2. Use Strong Passwords

```python
# Backend validates password strength automatically
# Frontend validation in utils/validation.ts
```

### 3. Rate Limiting is Active

- Anonymous: 100 requests/hour
- Authenticated: 1000 requests/hour
- Auth endpoints: 5 requests/hour

---

## 🧪 Testing Your Changes

### Write a Test

```python
# backend/myapp/tests.py
from django.test import TestCase

class MyModelTest(TestCase):
    def test_model_creation(self):
        # Your test here
        pass
```

### Run Specific Tests

```bash
pytest myapp/tests.py::MyModelTest::test_model_creation
```

---

## 📝 Code Style

### Backend (Python)

```bash
# Format code
black .

# Sort imports
isort .

# Check style
flake8 .
```

### Frontend (TypeScript)

```bash
# Type check
npm run type-check

# Lint
npm run lint
```

---

## 🚀 Deployment

### Production Checklist

1. **Set Environment Variables**

   ```env
   DEBUG=False
   SECRET_KEY=<strong-random-key>
   ALLOWED_HOSTS=yourdomain.com
   ```

2. **Collect Static Files**

   ```bash
   python manage.py collectstatic
   ```

3. **Run Migrations**

   ```bash
   python manage.py migrate --no-input
   ```

4. **Health Check**

   ```bash
   python manage.py health_check
   ```

5. **Use Gunicorn**
   ```bash
   gunicorn mobile_store.wsgi:application
   ```

---

## 📚 Documentation

- **API Documentation:** See [API.md](API.md)
- **Full README:** See [README_COMPREHENSIVE.md](README_COMPREHENSIVE.md)
- **Improvements:** See [IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md)

---

## 🔧 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
sudo service postgresql status  # Linux
brew services list              # macOS

# Verify credentials in .env
```

### Import Errors

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### TypeScript Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tests Failing

```bash
# Check test database
pytest -v  # Verbose output

# Check environment variables
cat .env
```

---

## 💡 Tips

1. **Use the Health Check:** Run `python manage.py health_check` regularly
2. **Check Logs:** Logs are in `backend/logs/` directory
3. **Use Migrations:** Always create migrations for model changes
4. **Write Tests:** Add tests for new features
5. **Document Code:** Add docstrings and comments

---

## 📞 Support

If you encounter issues:

1. Check [IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md) for details
2. Check [README_COMPREHENSIVE.md](README_COMPREHENSIVE.md) for setup
3. Check [API.md](API.md) for API documentation
4. Open an issue on GitHub

---

## ✨ What's New in v2.0?

- ✅ Comprehensive error handling
- ✅ Security hardening
- ✅ Input validation (frontend + backend)
- ✅ Testing infrastructure
- ✅ CI/CD pipeline
- ✅ Toast notifications
- ✅ Loading skeletons
- ✅ Confirmation dialogs
- ✅ Empty states
- ✅ Accessibility improvements
- ✅ Performance optimizations
- ✅ API documentation
- ✅ Production-ready configuration

---

**Happy Coding! 🎉**
