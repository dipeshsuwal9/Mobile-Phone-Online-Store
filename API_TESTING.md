# API Testing Guide

Use these curl commands or import into Postman to test the API endpoints.

## Authentication

### Register a new customer

```bash
curl -X POST http://localhost:8000/api/customers/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St, City, State 12345",
    "password": "SecurePass123!",
    "password2": "SecurePass123!"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/customers/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

Response will include:

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Get current user profile

```bash
curl -X GET http://localhost:8000/api/customers/profiles/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Phones & Brands

### List all phones

```bash
curl -X GET http://localhost:8000/api/phones/
```

### Search phones

```bash
curl -X GET "http://localhost:8000/api/phones/?search=iPhone"
```

### Filter phones by brand

```bash
curl -X GET "http://localhost:8000/api/phones/?brand=1"
```

### Get phone details

```bash
curl -X GET http://localhost:8000/api/phones/1/
```

### List all brands

```bash
curl -X GET http://localhost:8000/api/phones/brands/
```

### Create phone (admin only)

```bash
curl -X POST http://localhost:8000/api/phones/ \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "brand": 1,
    "model_name": "iPhone 15",
    "price": 79900.00,
    "stock_quantity": 50,
    "ram": "6GB",
    "storage": "128GB",
    "battery_capacity": "3279mAh",
    "processor": "A16 Bionic",
    "os": "iOS",
    "description": "Latest iPhone"
  }'
```

## Accessories

### List all accessories

```bash
curl -X GET http://localhost:8000/api/accessories/
```

### Filter by category

```bash
curl -X GET "http://localhost:8000/api/accessories/?category=Case"
```

### Get accessory details

```bash
curl -X GET http://localhost:8000/api/accessories/1/
```

## Cart Operations

### Get user's cart

```bash
curl -X GET http://localhost:8000/api/cart/my_cart/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Add item to cart

```bash
curl -X POST http://localhost:8000/api/cart/add_item/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_type": "PHONE",
    "product_id": 1,
    "quantity": 2
  }'
```

### Update cart item quantity

```bash
curl -X PATCH http://localhost:8000/api/cart/update_item/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cart_item_id": 1,
    "quantity": 3
  }'
```

### Remove item from cart

```bash
curl -X DELETE "http://localhost:8000/api/cart/remove_item/?cart_item_id=1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Clear cart

```bash
curl -X DELETE http://localhost:8000/api/cart/clear_cart/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Orders

### Get user's orders

```bash
curl -X GET http://localhost:8000/api/orders/my_orders/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create order from cart

```bash
curl -X POST http://localhost:8000/api/orders/create_from_cart/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address": "123 Main St, City, State 12345",
    "notes": "Please deliver before 5 PM"
  }'
```

### Get order details

```bash
curl -X GET http://localhost:8000/api/orders/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Cancel order

```bash
curl -X POST http://localhost:8000/api/orders/1/cancel/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update order status (admin only)

```bash
curl -X PATCH http://localhost:8000/api/orders/1/update_status/ \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SHIPPED"
  }'
```

## Payments

### Create payment

```bash
curl -X POST http://localhost:8000/api/payments/create_payment/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "payment_method": "CREDIT_CARD",
    "transaction_id": "TXN123456789",
    "notes": "Paid via Visa ending in 1234"
  }'
```

### Get user's payments

```bash
curl -X GET http://localhost:8000/api/payments/my_payments/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get payment details

```bash
curl -X GET http://localhost:8000/api/payments/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Token Refresh

### Refresh access token

```bash
curl -X POST http://localhost:8000/api/customers/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "YOUR_REFRESH_TOKEN"
  }'
```

## Testing Flow

1. **Register** a new customer
2. **Login** to get access token
3. **Browse** phones and accessories
4. **Add items** to cart
5. **View cart** to confirm items
6. **Create order** from cart
7. **Create payment** for the order
8. **View orders** to see order history

## Postman Collection

Import this into Postman for easy testing:

1. Create new collection "Mobile Store API"
2. Add environment with variables:
   - `base_url`: http://localhost:8000
   - `access_token`: (will be set after login)
3. Add all endpoints above
4. Use `{{base_url}}` and `{{access_token}}` variables

## Sample Response Examples

### Phone List Response

```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "phone_id": 1,
      "brand": 1,
      "brand_name": "Apple",
      "model_name": "iPhone 15 Pro",
      "price": "129900.00",
      "stock_quantity": 50,
      "ram": "8GB",
      "storage": "256GB",
      "battery_capacity": "3274mAh",
      "processor": "A17 Pro",
      "os": "iOS",
      "description": "Latest iPhone...",
      "is_in_stock": true,
      "created_at": "2024-12-03T10:00:00Z"
    }
  ]
}
```

### Cart Response

```json
{
  "cart_id": 1,
  "customer": 1,
  "customer_name": "John Doe",
  "items": [
    {
      "cart_item_id": 1,
      "product_type": "PHONE",
      "product_id": 1,
      "quantity": 2,
      "product_name": "Apple iPhone 15 Pro",
      "unit_price": "129900.00",
      "subtotal": "259800.00"
    }
  ],
  "total_items": 2,
  "total_amount": "259800.00"
}
```

### Order Response

```json
{
  "order_id": 1,
  "customer": 1,
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "order_date": "2024-12-03T11:30:00Z",
  "status": "PENDING",
  "total_amount": "259800.00",
  "shipping_address": "123 Main St...",
  "items": [
    {
      "order_item_id": 1,
      "product_type": "PHONE",
      "product_id": 1,
      "product_name": "Apple iPhone 15 Pro",
      "quantity": 2,
      "price_at_purchase": "129900.00",
      "subtotal": "259800.00"
    }
  ],
  "total_items": 2
}
```
