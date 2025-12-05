from rest_framework import serializers
from .models import Brand, MobilePhone


class BrandSerializer(serializers.ModelSerializer):
    """Serializer for Brand model"""
    phone_count = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = ['brand_id', 'brand_name', 'country_of_origin', 'phone_count', 'created_at', 'updated_at']
        read_only_fields = ['brand_id', 'created_at', 'updated_at']

    def get_phone_count(self, obj):
        return obj.phones.count()


class MobilePhoneSerializer(serializers.ModelSerializer):
    """Serializer for MobilePhone model"""
    brand_name = serializers.CharField(source='brand.brand_name', read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = MobilePhone
        fields = [
            'phone_id', 'brand', 'brand_name', 'model_name', 'price',
            'stock_quantity', 'ram', 'storage', 'battery_capacity',
            'processor', 'os', 'description', 'image_url',
            'is_in_stock', 'created_at', 'updated_at'
        ]
        read_only_fields = ['phone_id', 'created_at', 'updated_at']

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value

    def validate_stock_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock quantity cannot be negative")
        return value


class MobilePhoneDetailSerializer(MobilePhoneSerializer):
    """Detailed serializer for MobilePhone with brand details"""
    brand_details = BrandSerializer(source='brand', read_only=True)

    class Meta(MobilePhoneSerializer.Meta):
        fields = MobilePhoneSerializer.Meta.fields + ['brand_details']
