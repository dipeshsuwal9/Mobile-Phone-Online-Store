from rest_framework import serializers
from .models import Cart, CartItem
from phones.models import MobilePhone
from accessories.models import Accessory


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for CartItem model"""
    product_name = serializers.CharField(read_only=True)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = [
            'cart_item_id', 'product_type', 'product_id', 'quantity',
            'product_name', 'unit_price', 'subtotal', 'created_at'
        ]
        read_only_fields = ['cart_item_id', 'created_at']

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1")
        return value

    def validate(self, attrs):
        product_type = attrs.get('product_type')
        product_id = attrs.get('product_id')

        # Verify product exists
        if product_type == 'PHONE':
            product = MobilePhone.objects.filter(phone_id=product_id).first()
        elif product_type == 'ACCESSORY':
            product = Accessory.objects.filter(accessory_id=product_id).first()
        else:
            raise serializers.ValidationError("Invalid product type")

        if not product:
            raise serializers.ValidationError("Product not found")

        # Check stock
        quantity = attrs.get('quantity', 1)
        if product.stock_quantity < quantity:
            raise serializers.ValidationError(f"Only {product.stock_quantity} items available in stock")

        return attrs


class AddToCartSerializer(serializers.Serializer):
    """Serializer for adding items to cart"""
    product_type = serializers.ChoiceField(choices=['PHONE', 'ACCESSORY'])
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)

    def validate(self, attrs):
        product_type = attrs.get('product_type')
        product_id = attrs.get('product_id')
        quantity = attrs.get('quantity')

        # Verify product exists
        if product_type == 'PHONE':
            product = MobilePhone.objects.filter(phone_id=product_id).first()
        elif product_type == 'ACCESSORY':
            product = Accessory.objects.filter(accessory_id=product_id).first()
        else:
            raise serializers.ValidationError("Invalid product type")

        if not product:
            raise serializers.ValidationError("Product not found")

        # Check stock
        if product.stock_quantity < quantity:
            raise serializers.ValidationError(f"Only {product.stock_quantity} items available in stock")

        return attrs


class CartSerializer(serializers.ModelSerializer):
    """Serializer for Cart model"""
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model = Cart
        fields = ['cart_id', 'customer', 'customer_name', 'items', 'total_items', 'total_amount', 'created_at', 'updated_at']
        read_only_fields = ['cart_id', 'customer', 'created_at', 'updated_at']
