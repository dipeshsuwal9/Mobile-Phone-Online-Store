from rest_framework import serializers
from .models import Accessory


class AccessorySerializer(serializers.ModelSerializer):
    """Serializer for Accessory model"""
    is_in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Accessory
        fields = [
            'accessory_id', 'name', 'category', 'price', 'stock_quantity',
            'description', 'image_url', 'is_in_stock', 'created_at', 'updated_at'
        ]
        read_only_fields = ['accessory_id', 'created_at', 'updated_at']

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value

    def validate_stock_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock quantity cannot be negative")
        return value
