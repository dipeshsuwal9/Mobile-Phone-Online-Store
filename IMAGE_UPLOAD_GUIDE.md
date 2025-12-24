# Image Upload Feature Guide

## Overview

The backend now supports **dual-mode image handling** for products (Mobile Phones and Accessories):

- **Option 1**: Provide an image URL (original method)
- **Option 2**: Upload an image file directly (new feature)

## Backend Changes

### Models Updated

- **MobilePhone** (`backend/phones/models.py`)
  - Added `image` field: `ImageField(upload_to='phones/', blank=True, null=True)`
  - Added `get_image_url()` method that returns uploaded file URL if exists, otherwise returns `image_url`
- **Accessory** (`backend/accessories/models.py`)
  - Added `image` field: `ImageField(upload_to='accessories/', blank=True, null=True)`
  - Added `get_image_url()` method with same logic

### Serializers Updated

- **MobilePhoneSerializer** & **AccessorySerializer**
  - Added `image` field for file uploads
  - Added `image_display` field (SerializerMethodField) that:
    - Returns uploaded file URL if image exists
    - Falls back to `image_url` if no file uploaded
    - Builds absolute URLs for frontend consumption

### ViewSets Updated

- Added parser classes to support multipart/form-data:
  - `MultiPartParser` - for file uploads
  - `FormParser` - for form data
  - `JSONParser` - for JSON requests

### Media Configuration

- Media files stored in: `backend/media/`
- Phones uploaded to: `backend/media/phones/`
- Accessories uploaded to: `backend/media/accessories/`
- Media URL: `http://localhost:8000/media/`

## Frontend Changes

### TypeScript Types Updated

```typescript
export interface MobilePhone {
  // ... other fields
  image_url?: string; // Original URL field
  image?: string; // Uploaded file path
  image_display?: string; // Best available image URL (from backend)
}

export interface Accessory {
  // ... other fields
  image_url?: string;
  image?: string;
  image_display?: string;
}
```

### Components Updated

- **ProductCard.tsx** - Uses `image_display` with fallback to `image_url`
- **PhoneDetail.tsx** - Uses `image_display` with fallback to `image_url`

## How to Use

### Django Admin

1. Go to `http://localhost:8000/admin/`
2. Edit a Mobile Phone or Accessory
3. You'll see two fields:
   - **Image URL**: Paste a URL (optional)
   - **Image**: Upload a file (optional)
4. You can use either field or both (uploaded file takes priority)

### API (Using curl)

#### Upload Image with JSON Data

```bash
curl -X POST http://localhost:8000/api/phones/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "model_name=iPhone 15 Pro" \
  -F "brand=1" \
  -F "price=99999" \
  -F "stock_quantity=10" \
  -F "ram=8GB" \
  -F "storage=256GB" \
  -F "battery_capacity=3274mAh" \
  -F "processor=A17 Pro" \
  -F "operating_system=iOS 17" \
  -F "image=@/path/to/your/image.jpg"
```

#### Update with Image URL Only

```bash
curl -X PATCH http://localhost:8000/api/phones/1/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://example.com/phone.jpg"}'
```

#### Update with Uploaded File

```bash
curl -X PATCH http://localhost:8000/api/phones/1/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/new-image.jpg"
```

### API Response

The API returns both fields:

```json
{
  "phone_id": 1,
  "model_name": "iPhone 15 Pro",
  "image_url": "https://example.com/phone.jpg",
  "image": "/media/phones/iphone15.jpg",
  "image_display": "http://localhost:8000/media/phones/iphone15.jpg"
  // ... other fields
}
```

Frontend should use `image_display` field for rendering images.

## Dependencies

- **Pillow**: Required for Django ImageField support
  - Installed: `Pillow==12.0.0`
  - Listed in `requirements.txt`

## Migration Applied

```bash
# Migrations created and applied
accessories/migrations/0002_accessory_image_alter_accessory_image_url.py
phones/migrations/0002_mobilephone_image_alter_mobilephone_image_url.py
```

## Testing the Feature

### 1. Via Django Admin

- Navigate to http://localhost:8000/admin/
- Login with superuser credentials
- Go to Phones or Accessories
- Add/Edit an item and upload an image
- Verify the image appears in the detail view

### 2. Via API (Postman/Insomnia)

- Create POST/PATCH request to `/api/phones/` or `/api/accessories/`
- Set Content-Type to `multipart/form-data`
- Add form fields + image file
- Check response includes `image_display` field

### 3. Via Frontend

- The frontend will automatically use `image_display` field
- Image cards will show uploaded images or URL images
- No frontend changes needed for basic usage

## File Upload Limits

- Default Django file upload size: **2.5 MB**
- To increase, add to `settings.py`:
  ```python
  DATA_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB
  FILE_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB
  ```

## Production Considerations

1. **Media Files**: Use cloud storage (AWS S3, Cloudinary) instead of local filesystem
2. **Image Optimization**: Consider using Django ImageKit or Pillow for thumbnails
3. **CDN**: Serve media files through CDN for better performance
4. **Security**: Validate file types and sizes to prevent malicious uploads

## Backward Compatibility

✅ **Fully backward compatible**

- Existing products with `image_url` will continue to work
- `image_display` returns `image_url` if no file uploaded
- Both fields are optional (blank=True, null=True)
