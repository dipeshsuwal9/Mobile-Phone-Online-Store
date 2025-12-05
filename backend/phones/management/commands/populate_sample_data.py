"""
Django management command to populate sample data
Usage: python manage.py populate_sample_data
"""

from django.core.management.base import BaseCommand
from phones.models import Brand, MobilePhone
from accessories.models import Accessory


class Command(BaseCommand):
    help = 'Populates the database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample data...')

        # Create Brands
        brands_data = [
            {'brand_name': 'Apple', 'country_of_origin': 'USA'},
            {'brand_name': 'Samsung', 'country_of_origin': 'South Korea'},
            {'brand_name': 'Google', 'country_of_origin': 'USA'},
            {'brand_name': 'OnePlus', 'country_of_origin': 'China'},
            {'brand_name': 'Xiaomi', 'country_of_origin': 'China'},
        ]

        brands = {}
        for brand_data in brands_data:
            brand, created = Brand.objects.get_or_create(**brand_data)
            brands[brand.brand_name] = brand
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created brand: {brand.brand_name}'))

        # Create Phones
        phones_data = [
            {
                'brand': brands['Apple'],
                'model_name': 'iPhone 15 Pro',
                'price': 129900.00,
                'stock_quantity': 50,
                'ram': '8GB',
                'storage': '256GB',
                'battery_capacity': '3274mAh',
                'processor': 'A17 Pro',
                'os': 'iOS',
                'description': 'Latest iPhone with titanium design and advanced camera system'
            },
            {
                'brand': brands['Samsung'],
                'model_name': 'Galaxy S24 Ultra',
                'price': 124999.00,
                'stock_quantity': 45,
                'ram': '12GB',
                'storage': '512GB',
                'battery_capacity': '5000mAh',
                'processor': 'Snapdragon 8 Gen 3',
                'os': 'Android',
                'description': 'Premium flagship with S Pen and AI features'
            },
            {
                'brand': brands['Google'],
                'model_name': 'Pixel 8 Pro',
                'price': 89999.00,
                'stock_quantity': 30,
                'ram': '12GB',
                'storage': '256GB',
                'battery_capacity': '5050mAh',
                'processor': 'Google Tensor G3',
                'os': 'Android',
                'description': 'Best Android camera with pure Google experience'
            },
            {
                'brand': brands['OnePlus'],
                'model_name': 'OnePlus 12',
                'price': 64999.00,
                'stock_quantity': 60,
                'ram': '16GB',
                'storage': '256GB',
                'battery_capacity': '5400mAh',
                'processor': 'Snapdragon 8 Gen 3',
                'os': 'Android',
                'description': 'Flagship killer with super-fast charging'
            },
            {
                'brand': brands['Xiaomi'],
                'model_name': 'Xiaomi 14 Pro',
                'price': 69999.00,
                'stock_quantity': 40,
                'ram': '12GB',
                'storage': '512GB',
                'battery_capacity': '4880mAh',
                'processor': 'Snapdragon 8 Gen 3',
                'os': 'Android',
                'description': 'Premium features at competitive price'
            },
        ]

        for phone_data in phones_data:
            phone, created = MobilePhone.objects.get_or_create(
                brand=phone_data['brand'],
                model_name=phone_data['model_name'],
                defaults=phone_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created phone: {phone}'))

        # Create Accessories
        accessories_data = [
            {
                'name': 'Premium Silicone Case',
                'category': 'Case',
                'price': 1499.00,
                'stock_quantity': 100,
                'description': 'High-quality silicone case with perfect fit'
            },
            {
                'name': 'Fast Charger 65W',
                'category': 'Charger',
                'price': 2499.00,
                'stock_quantity': 80,
                'description': 'Super fast charging adapter with cable'
            },
            {
                'name': 'Wireless Earbuds Pro',
                'category': 'Earphones',
                'price': 8999.00,
                'stock_quantity': 50,
                'description': 'Premium wireless earbuds with ANC'
            },
            {
                'name': 'Tempered Glass Screen Protector',
                'category': 'Screen Protector',
                'price': 599.00,
                'stock_quantity': 200,
                'description': '9H hardness tempered glass protection'
            },
            {
                'name': 'Power Bank 20000mAh',
                'category': 'Power Bank',
                'price': 3999.00,
                'stock_quantity': 60,
                'description': 'High-capacity power bank with dual USB ports'
            },
            {
                'name': 'USB-C to USB-C Cable',
                'category': 'Cable',
                'price': 799.00,
                'stock_quantity': 150,
                'description': 'Durable braided cable supporting fast charging'
            },
            {
                'name': 'Car Phone Mount',
                'category': 'Other',
                'price': 1299.00,
                'stock_quantity': 70,
                'description': 'Secure magnetic car mount holder'
            },
        ]

        for accessory_data in accessories_data:
            accessory, created = Accessory.objects.get_or_create(
                name=accessory_data['name'],
                defaults=accessory_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created accessory: {accessory.name}'))

        self.stdout.write(self.style.SUCCESS('\n✅ Sample data created successfully!'))
        self.stdout.write(self.style.WARNING('\nYou can now:'))
        self.stdout.write('1. Visit http://localhost:8000/admin/ to view the data')
        self.stdout.write('2. Visit http://localhost:5173 to browse products')
