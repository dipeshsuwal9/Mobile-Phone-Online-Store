# Mobile Phone Online Store - API Documentation

## Base URL

```
http://localhost:8000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### Register

**POST** `/auth/register/`

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "phone_number": "+1234567890",
  "address": "123 Main St, City, State 12345"
}
```

**Response (201 Created):**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone_number": "+1234567890"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

---

### Login

**POST** `/auth/login/`

Authenticate and receive JWT tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### Get Current User

**GET** `/auth/me/`

Get current authenticated user profile.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone_number": "+1234567890",
  "address": "123 Main St, City, State 12345"
}
```

---

## Phone Endpoints

### List Phones

**GET** `/phones/`

Get paginated list of mobile phones.

**Query Parameters:**

- `page` (integer): Page number (default: 1)
- `search` (string): Search by model name, brand, or processor
- `brand` (integer): Filter by brand ID
- `os` (string): Filter by operating system
- `ram` (integer): Filter by RAM size
- `storage` (integer): Filter by storage size
- `ordering` (string): Order by field (e.g., `price`, `-created_at`)

**Response (200 OK):**

```json
{
  "count": 50,
  "next": "http://localhost:8000/api/phones/?page=2",
  "previous": null,
  "results": [
    {
      "phone_id": 1,
      "brand": {
        "brand_id": 1,
        "brand_name": "Apple"
      },
      "model_name": "iPhone 15 Pro",
      "price": "999.99",
      "stock_quantity": 25,
      "screen_size": "6.1",
      "battery_capacity": 3200,
      "ram": 8,
      "storage": 256,
      "os": "iOS",
      "image_url": "http://localhost:8000/media/phones/iphone15.jpg"
    }
  ]
}
```

---

### Get Phone Detail

**GET** `/phones/{id}/`

Get detailed information about a specific phone.

**Response (200 OK):**

```json
{
  "phone_id": 1,
  "brand": {
    "brand_id": 1,
    "brand_name": "Apple",
    "country_of_origin": "USA"
  },
  "model_name": "iPhone 15 Pro",
  "price": "999.99",
  "stock_quantity": 25,
  "screen_size": "6.1",
  "battery_capacity": 3200,
  "ram": 8,
  "storage": 256,
  "os": "iOS",
  "processor": "A17 Pro",
  "camera_specs": "48MP Main, 12MP Ultra Wide",
  "features": "Dynamic Island, Always-On Display",
  "image_url": "http://localhost:8000/media/phones/iphone15.jpg",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

## Cart Endpoints

### Get Cart

**GET** `/cart/my-cart/`

Get current user's cart.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "cart_id": 1,
  "customer": 1,
  "items": [
    {
      "cart_item_id": 1,
      "product_type": "PHONE",
      "product_id": 1,
      "product_name": "Apple iPhone 15 Pro",
      "quantity": 1,
      "unit_price": "999.99",
      "subtotal": "999.99"
    }
  ],
  "total_amount": "999.99",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T11:00:00Z"
}
```

---

### Add to Cart

**POST** `/cart/add/`

Add item to cart.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "product_type": "PHONE",
  "product_id": 1,
  "quantity": 1
}
```

**Response (201 Created):**

```json
{
  "message": "Item added to cart successfully",
  "cart": {
    "cart_id": 1,
    "total_amount": "999.99"
  }
}
```

---

### Update Cart Item

**PATCH** `/cart/items/{item_id}/`

Update cart item quantity.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "quantity": 2
}
```

**Response (200 OK):**

```json
{
  "message": "Cart item updated successfully",
  "item": {
    "cart_item_id": 1,
    "quantity": 2,
    "subtotal": "1999.98"
  }
}
```

---

### Remove from Cart

**DELETE** `/cart/items/{item_id}/`

Remove item from cart.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

---

## Order Endpoints

### Create Order from Cart

**POST** `/orders/create_from_cart/`

Create order from current cart.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "shipping_address": "123 Main St, City, State 12345",
  "notes": "Please deliver in the morning"
}
```

**Response (201 Created):**

```json
{
  "order_id": 1,
  "customer": 1,
  "total_amount": "999.99",
  "shipping_address": "123 Main St, City, State 12345",
  "status": "PENDING",
  "items": [
    {
      "order_item_id": 1,
      "product_type": "PHONE",
      "product_name": "Apple iPhone 15 Pro",
      "quantity": 1,
      "price_at_purchase": "999.99"
    }
  ],
  "created_at": "2024-01-15T12:00:00Z"
}
```

---

### List User Orders

**GET** `/orders/my_orders/`

Get current user's orders.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
[
  {
    "order_id": 1,
    "total_amount": "999.99",
    "status": "PROCESSING",
    "created_at": "2024-01-15T12:00:00Z",
    "items_count": 1
  }
]
```

---

### Get Order Detail

**GET** `/orders/{id}/`

Get detailed information about a specific order.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "order_id": 1,
  "customer": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "total_amount": "999.99",
  "shipping_address": "123 Main St, City, State 12345",
  "status": "PROCESSING",
  "notes": "Please deliver in the morning",
  "items": [
    {
      "order_item_id": 1,
      "product_type": "PHONE",
      "product_id": 1,
      "product_name": "Apple iPhone 15 Pro",
      "quantity": 1,
      "price_at_purchase": "999.99"
    }
  ],
  "created_at": "2024-01-15T12:00:00Z",
  "updated_at": "2024-01-15T12:30:00Z"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "message": "User-friendly error message",
    "code": 400,
    "details": {
      "field_name": ["Specific field error"]
    }
  }
}
```

### Common Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Rate Limiting

API endpoints are rate limited:

- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour
- Authentication endpoints: 5 requests/hour

When rate limit is exceeded, you'll receive a 429 response with:

```json
{
  "success": false,
  "error": {
    "message": "Too many requests. Please try again later.",
    "code": 429
  }
}
```

---

## Pagination

List endpoints return paginated results with the following structure:

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/phones/?page=3",
  "previous": "http://localhost:8000/api/phones/?page=1",
  "results": []
}
```

Default page size: 20 items
Maximum page size: 100 items

---

## Webhooks (Future Feature)

Webhook endpoints for order status updates will be available in future releases.

---

## Support

For API support, contact: admin@mobilestore.com
