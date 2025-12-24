# Backend-Frontend Sync Debugging Guide

## 🔍 Issues Found and Fixed

### **CRITICAL ISSUE #1: CORS Port Mismatch** ✅ FIXED

**Problem**: Frontend running on `localhost:5174` but backend CORS only allowed `localhost:5173`

**Symptoms**:

- No visible errors in browser console (sometimes)
- API requests might work but data doesn't update
- Preflight OPTIONS requests may fail silently

**Root Cause**: When Vite found port 5173 in use, it automatically used 5174, but Django's CORS settings didn't include this port.

**Fix Applied**:

```python
# backend/mobile_store/settings.py
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',  # ← Added
    'http://127.0.0.1:5174',  # ← Added
]
```

---

### **ISSUE #2: Browser & HTTP Caching** ✅ FIXED

**Problem**: No cache-control headers on API responses, causing browser to cache stale data

**Symptoms**:

- Changes in Django admin don't appear in frontend
- Hard refresh (Ctrl+Shift+R) shows new data
- Private/incognito mode shows updated data

**Root Cause**:

- Backend didn't send cache-control headers
- Browser cached GET requests
- Axios didn't add cache-busting parameters

**Fixes Applied**:

1. **Backend - Added Cache-Control Headers**:

```python
# backend/phones/views.py & accessories/views.py
@method_decorator(never_cache)
def list(self, request, *args, **kwargs):
    response = super().list(request, *args, **kwargs)
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response
```

2. **Frontend - Axios Headers**:

```typescript
// frontend/src/services/api.ts
const api = axios.create({
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});
```

3. **Frontend - Cache-Busting Timestamps**:

```typescript
// frontend/src/services/phoneService.ts
async getAllPhones(params) {
  const response = await api.get("/phones/", {
    params: { ...params, _t: Date.now() }  // ← Timestamp parameter
  });
  return response.data;
}
```

---

### **ISSUE #3: Missing useEffect Dependencies** ✅ VERIFIED OK

**Status**: Checked and found to be correctly implemented

**Current Implementation**:

```tsx
useEffect(() => {
  loadPhones();
}, [search]); // ← Correctly re-fetches when search changes
```

**Note**: If you add filters (brand, price range, etc.), add them to dependencies:

```tsx
useEffect(() => {
  loadPhones();
}, [search, brand, minPrice, maxPrice]); // ← Add all filter dependencies
```

---

### **ISSUE #4: No Automatic Refresh Mechanism** ⚠️ IDENTIFIED

**Problem**: Frontend only fetches data on component mount, not when returning from other pages

**Current Behavior**:

- User visits catalog → Data loads
- User edits in admin → Data changes
- User returns to catalog → **OLD DATA** (component already mounted)

**Solution Options**:

#### Option A: Refetch on Window Focus (Recommended)

```tsx
// Add to PhoneCatalog.tsx and Accessories.tsx
useEffect(() => {
  loadPhones();

  // Refetch when user returns to tab/window
  const handleFocus = () => {
    loadPhones();
  };

  window.addEventListener("focus", handleFocus);
  return () => window.removeEventListener("focus", handleFocus);
}, [search]);
```

#### Option B: Add Manual Refresh Button

```tsx
const handleRefresh = () => {
  setLoading(true);
  loadPhones();
};

// In JSX:
<button onClick={handleRefresh}>
  <FiRefreshCw /> Refresh
</button>;
```

#### Option C: Polling (Auto-refresh every X seconds)

```tsx
useEffect(() => {
  loadPhones();

  // Refresh every 30 seconds
  const interval = setInterval(() => {
    loadPhones();
  }, 30000);

  return () => clearInterval(interval);
}, [search]);
```

#### Option D: Use React Query (Best for Large Apps)

```bash
npm install @tanstack/react-query
```

```tsx
import { useQuery } from "@tanstack/react-query";

const { data, isLoading, refetch } = useQuery({
  queryKey: ["phones", search],
  queryFn: () => phoneService.getAllPhones({ search }),
  staleTime: 0, // Always consider data stale
  refetchOnWindowFocus: true, // Auto-refetch on focus
  refetchOnMount: true,
});
```

---

## 🧪 Step-by-Step Testing Guide

### Test 1: Verify CORS Fix

```bash
# 1. Check current frontend port
# Look at terminal: "Local: http://localhost:XXXX/"

# 2. Test CORS with curl
curl -H "Origin: http://localhost:5174" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     http://localhost:8000/api/phones/ \
     -v 2>&1 | grep -i "access-control"

# Should see:
# Access-Control-Allow-Origin: http://localhost:5174
```

### Test 2: Verify Cache Headers

```bash
# Check cache-control headers
curl -I http://localhost:8000/api/phones/

# Should see:
# Cache-Control: no-cache, no-store, must-revalidate
# Pragma: no-cache
# Expires: 0
```

### Test 3: Browser DevTools Check

1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by **Fetch/XHR**
4. Reload page
5. Click on any API request
6. Check **Response Headers**:
   - ✅ `Cache-Control: no-cache, no-store, must-revalidate`
   - ✅ `Access-Control-Allow-Origin: http://localhost:5174`

### Test 4: End-to-End Sync Test

```bash
# Terminal 1: Backend (should already be running)
cd backend
source .venv/bin/activate  # or: .venv/bin/python manage.py runserver
python manage.py runserver

# Terminal 2: Frontend (should already be running)
cd frontend
npm run dev

# Steps:
1. Open browser → http://localhost:5174
2. Note current products
3. Open admin → http://localhost:8000/admin
4. Add/Edit a product
5. Return to frontend (http://localhost:5174)
6. Refresh page (F5)
7. ✅ Should see updated data immediately
```

### Test 5: Verify Timestamp Cache-Busting

```bash
# Open browser DevTools → Network tab
# Look at API requests, should see:
# http://localhost:8000/api/phones/?_t=1702281234567
#                                    ↑ Timestamp changes each request
```

---

## 🐛 Common Debugging Commands

### Check if Backend is Running

```bash
curl http://localhost:8000/api/phones/
# Should return JSON with products
```

### Check if Frontend Can Reach Backend

```bash
# In browser console (F12)
fetch('http://localhost:8000/api/phones/')
  .then(r => r.json())
  .then(console.log)
```

### Clear All Caches

```bash
# 1. Clear browser cache (Chrome/Firefox)
Ctrl + Shift + Delete → Clear browsing data → Cached images and files

# 2. Clear axios cache (if using cache interceptor)
localStorage.clear()
sessionStorage.clear()

# 3. Hard reload
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)

# 4. Restart backend server
# Kill and restart: python manage.py runserver

# 5. Restart frontend server
# Kill (Ctrl+C) and: npm run dev
```

### Check Django Logs for Errors

```bash
# Backend terminal should show:
# [11/Dec/2025 11:30:12] "GET /api/phones/ HTTP/1.1" 200 1234
#                                                      ↑ Should be 200, not 304
```

### Test API Directly in Browser

```
http://localhost:8000/api/phones/
http://localhost:8000/api/accessories/
```

---

## ⚙️ Configuration Checklist

### Backend (`backend/mobile_store/settings.py`)

- [x] CORS includes frontend port (5174)
- [x] Cache-control headers added to viewsets
- [x] DEBUG=True (for development)
- [x] ALLOWED_HOSTS includes localhost

### Frontend (`frontend/src/`)

- [x] API_URL points to `http://localhost:8000/api`
- [x] Cache-Control headers in axios config
- [x] Timestamp parameters in service calls
- [x] useEffect dependencies are correct

### Environment Files

- [x] `.env.example` updated with correct ports
- [ ] Create `.env` file if missing (copy from .env.example)

---

## 🚀 Restart Services (If Issues Persist)

### Full Clean Restart

```bash
# 1. Stop all services (Ctrl+C in both terminals)

# 2. Clear Python cache
cd backend
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
find . -name "*.pyc" -delete

# 3. Restart backend
source .venv/bin/activate
python manage.py runserver

# 4. Clear frontend cache and restart
cd ../frontend
rm -rf node_modules/.vite
npm run dev

# 5. Clear browser cache (Ctrl+Shift+Delete)

# 6. Test again
```

---

## 📊 Quick Diagnosis Table

| Symptom                                | Likely Cause        | Solution                                  |
| -------------------------------------- | ------------------- | ----------------------------------------- |
| CORS error in console                  | Port mismatch       | Check frontend port, update CORS settings |
| Data appears after hard refresh        | Browser cache       | Add cache-control headers                 |
| Data updates in admin but not frontend | No cache-busting    | Add timestamp params + headers            |
| Changes visible in incognito mode      | Browser cache       | Clear cache or add no-cache headers       |
| 304 responses in Network tab           | Server caching      | Add `@never_cache` decorator              |
| Old data when returning to page        | No refetch on mount | Add window focus listener or React Query  |
| API works in Postman, not browser      | CORS issue          | Check CORS configuration                  |

---

## 🔧 Applied Changes Summary

### Files Modified:

1. `backend/mobile_store/settings.py` - Added port 5174 to CORS
2. `backend/phones/views.py` - Added cache-control headers
3. `backend/accessories/views.py` - Added cache-control headers
4. `backend/.env.example` - Updated CORS origins
5. `frontend/src/services/api.ts` - Added cache-control headers
6. `frontend/src/services/phoneService.ts` - Added timestamp params
7. `frontend/src/services/accessoryService.ts` - Added timestamp params

### Testing Status:

✅ CORS configuration fixed  
✅ Cache-control headers added  
✅ Timestamp cache-busting implemented  
✅ API endpoints verified  
⚠️ Manual refresh still required (see refetch options above)

---

## 🎯 Next Steps

### Immediate Testing:

1. **Restart backend server** (if running)
2. **Refresh frontend** (should auto-reload)
3. **Clear browser cache** (Ctrl+Shift+Delete)
4. **Test the sync**:
   - Add a product in admin
   - Refresh frontend page
   - Should see new product immediately

### Optional Improvements:

1. **Add refetch on window focus** (Option A above)
2. **Add manual refresh button** (Option B above)
3. **Consider React Query** for automatic cache management
4. **Add loading states** during refetch
5. **Add error boundaries** for failed requests

### Production Considerations:

1. Set appropriate cache headers for production (5-10 minutes)
2. Use environment-specific CORS origins
3. Implement proper error handling
4. Add request retry logic
5. Consider adding Redis for server-side caching

---

## 📞 Still Having Issues?

If problems persist after applying these fixes:

1. **Check browser console** (F12) for errors
2. **Check backend logs** for 500 errors
3. **Verify both servers are running** on correct ports
4. **Try incognito/private window** to rule out extensions
5. **Check network tab** for failed requests
6. **Verify database has data**: `python manage.py shell` → `from phones.models import MobilePhone; print(MobilePhone.objects.count())`

### Debug Commands:

```bash
# Check if data exists in database
cd backend
source .venv/bin/activate
python manage.py shell
>>> from phones.models import MobilePhone
>>> MobilePhone.objects.all()
>>> exit()

# Create test data if empty
python manage.py shell
>>> from phones.models import Brand, MobilePhone
>>> brand = Brand.objects.create(brand_name="Test Brand")
>>> MobilePhone.objects.create(
...     brand=brand,
...     model_name="Test Phone",
...     price="999",
...     stock_quantity=10,
...     ram="8GB",
...     storage="128GB",
...     battery_capacity="4000mAh",
...     processor="Test Chip",
...     operating_system="Android"
... )
>>> exit()
```

Now refresh your frontend and you should see the test product!
