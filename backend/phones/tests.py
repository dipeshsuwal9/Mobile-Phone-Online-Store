"""
Tests for phones app models.
"""

from django.test import TestCase
from django.core.exceptions import ValidationError
from decimal import Decimal
from phones.models import Brand, MobilePhone


class BrandModelTest(TestCase):
    """Test cases for Brand model."""
    
    def setUp(self):
        """Set up test data."""
        self.brand_data = {
            'brand_name': 'Apple',
            'country_of_origin': 'USA',
            'website': 'https://www.apple.com',
        }
    
    def test_brand_creation(self):
        """Test creating a brand instance."""
        brand = Brand.objects.create(**self.brand_data)
        self.assertEqual(brand.brand_name, 'Apple')
        self.assertEqual(brand.country_of_origin, 'USA')
        self.assertIsNotNone(brand.created_at)
        self.assertIsNotNone(brand.updated_at)
    
    def test_brand_str_representation(self):
        """Test brand string representation."""
        brand = Brand.objects.create(**self.brand_data)
        self.assertEqual(str(brand), 'Apple')
    
    def test_brand_name_required(self):
        """Test that brand name is required."""
        brand = Brand(country_of_origin='USA')
        with self.assertRaises(ValidationError):
            brand.full_clean()
    
    def test_brand_unique_name(self):
        """Test that brand name must be unique."""
        Brand.objects.create(**self.brand_data)
        with self.assertRaises(Exception):
            Brand.objects.create(**self.brand_data)


class MobilePhoneModelTest(TestCase):
    """Test cases for MobilePhone model."""
    
    def setUp(self):
        """Set up test data."""
        self.brand = Brand.objects.create(
            brand_name='Samsung',
            country_of_origin='South Korea'
        )
        
        self.phone_data = {
            'brand': self.brand,
            'model_name': 'Galaxy S24',
            'price': Decimal('999.99'),
            'stock_quantity': 50,
            'screen_size': Decimal('6.2'),
            'battery_capacity': 4000,
            'ram': 8,
            'storage': 256,
            'os': 'Android',
            'processor': 'Snapdragon 8 Gen 3',
        }
    
    def test_phone_creation(self):
        """Test creating a phone instance."""
        phone = MobilePhone.objects.create(**self.phone_data)
        self.assertEqual(phone.model_name, 'Galaxy S24')
        self.assertEqual(phone.brand, self.brand)
        self.assertEqual(phone.price, Decimal('999.99'))
        self.assertEqual(phone.stock_quantity, 50)
    
    def test_phone_str_representation(self):
        """Test phone string representation."""
        phone = MobilePhone.objects.create(**self.phone_data)
        self.assertEqual(str(phone), 'Samsung Galaxy S24')
    
    def test_phone_price_validation(self):
        """Test that price must be positive."""
        phone_data = self.phone_data.copy()
        phone_data['price'] = Decimal('-10.00')
        phone = MobilePhone(**phone_data)
        with self.assertRaises(ValidationError):
            phone.full_clean()
    
    def test_phone_stock_quantity_validation(self):
        """Test that stock quantity cannot be negative."""
        phone_data = self.phone_data.copy()
        phone_data['stock_quantity'] = -5
        phone = MobilePhone(**phone_data)
        with self.assertRaises(ValidationError):
            phone.full_clean()
    
    def test_phone_required_fields(self):
        """Test that required fields are enforced."""
        phone = MobilePhone(brand=self.brand)
        with self.assertRaises(ValidationError):
            phone.full_clean()
    
    def test_phone_timestamps(self):
        """Test that timestamps are set automatically."""
        phone = MobilePhone.objects.create(**self.phone_data)
        self.assertIsNotNone(phone.created_at)
        self.assertIsNotNone(phone.updated_at)
        
        # Update the phone and check updated_at changes
        original_updated = phone.updated_at
        phone.price = Decimal('899.99')
        phone.save()
        self.assertGreater(phone.updated_at, original_updated)
