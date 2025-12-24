from rest_framework import serializers
from .models import Accessory


class AccessorySerializer(serializers.ModelSerializer):
    """Serializer for Accessory model"""
    is_in_stock = serializers.BooleanField(read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)
    image_display = serializers.SerializerMethodField()

    class Meta:
        model = Accessory
        fields = [
            'accessory_id', 'name', 'category', 'price', 'stock_quantity',
            'description', 'image_url', 'image', 'image_display', 'is_in_stock', 'created_at', 'updated_at'
        ]
        read_only_fields = ['accessory_id', 'created_at', 'updated_at']
    
    def get_image_display(self, obj):
        """Return the best available image URL"""
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value

    def validate_stock_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock quantity cannot be negative")
        return value
