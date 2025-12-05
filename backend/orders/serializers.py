from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model"""
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'order_item_id', 'product_type', 'product_id', 'product_name',
            'quantity', 'price_at_purchase', 'subtotal', 'created_at'
        ]
        read_only_fields = ['order_item_id', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model"""
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'order_id', 'customer', 'customer_name', 'customer_email',
            'order_date', 'status', 'total_amount', 'shipping_address',
            'notes', 'items', 'total_items', 'updated_at'
        ]
        read_only_fields = ['order_id', 'customer', 'order_date', 'total_amount', 'updated_at']


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating order from cart"""
    shipping_address = serializers.CharField()
    notes = serializers.CharField(required=False, allow_blank=True)
