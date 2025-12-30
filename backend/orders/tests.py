"""
Tests for orders app models and views.
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal
from phones.models import Brand, MobilePhone
from orders.models import Order, OrderItem
from cart.models import Cart, CartItem

User = get_user_model()


class OrderModelTest(TestCase):
    """Test cases for Order model."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            full_name='Test User'
        )
        
        self.order_data = {
            'customer': self.user,
            'total_amount': Decimal('999.99'),
            'shipping_address': '123 Test St, Test City, TC 12345',
            'status': 'PENDING',
        }
    
    def test_order_creation(self):
        """Test creating an order."""
        order = Order.objects.create(**self.order_data)
        self.assertEqual(order.customer, self.user)
        self.assertEqual(order.total_amount, Decimal('999.99'))
        self.assertEqual(order.status, 'PENDING')
        self.assertIsNotNone(order.created_at)
    
    def test_order_str_representation(self):
        """Test order string representation."""
        order = Order.objects.create(**self.order_data)
        expected = f"Order #{order.order_id} - {self.user.email}"
        self.assertEqual(str(order), expected)
    
    def test_order_status_choices(self):
        """Test order status validation."""
        order = Order.objects.create(**self.order_data)
        valid_statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
        
        for status_choice in valid_statuses:
            order.status = status_choice
            order.save()
            self.assertEqual(order.status, status_choice)


class OrderAPITest(APITestCase):
    """Test cases for Order API endpoints."""
    
    def setUp(self):
        """Set up test data and client."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            full_name='Test User'
        )
        
        # Create test brand and phone
        self.brand = Brand.objects.create(
            brand_name='Apple',
            country_of_origin='USA'
        )
        
        self.phone = MobilePhone.objects.create(
            brand=self.brand,
            model_name='iPhone 15',
            price=Decimal('999.99'),
            stock_quantity=10,
            screen_size=Decimal('6.1'),
            battery_capacity=3200,
            ram=8,
            storage=256,
            os='iOS',
            processor='A17 Pro'
        )
        
        # Authenticate user
        self.client.force_authenticate(user=self.user)
    
    def test_create_order_from_cart(self):
        """Test creating an order from cart."""
        # Create cart and cart item
        cart = Cart.objects.create(customer=self.user)
        CartItem.objects.create(
            cart=cart,
            product_type='PHONE',
            product_id=self.phone.phone_id,
            product_name=str(self.phone),
            quantity=1,
            unit_price=self.phone.price
        )
        
        order_data = {
            'shipping_address': '123 Test St, Test City, TC 12345',
            'notes': 'Please deliver in the morning'
        }
        
        response = self.client.post('/api/orders/create_from_cart/', order_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(OrderItem.objects.count(), 1)
        
        # Check cart is cleared
        self.assertEqual(cart.items.count(), 0)
    
    def test_list_user_orders(self):
        """Test listing user's orders."""
        Order.objects.create(
            customer=self.user,
            total_amount=Decimal('999.99'),
            shipping_address='123 Test St',
            status='PENDING'
        )
        
        response = self.client.get('/api/orders/my_orders/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_unauthorized_access(self):
        """Test that unauthenticated users cannot access orders."""
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/orders/')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
