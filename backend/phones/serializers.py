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
    image = serializers.ImageField(required=False, allow_null=True)
    image_display = serializers.SerializerMethodField()

    class Meta:
        model = MobilePhone
        fields = [
            'phone_id', 'brand', 'brand_name', 'model_name', 'price',
            'stock_quantity', 'ram', 'storage', 'battery_capacity',
            'processor', 'os', 'description', 'image_url', 'image', 'image_display',
            'is_in_stock', 'created_at', 'updated_at'
        ]
        read_only_fields = ['phone_id', 'created_at', 'updated_at']
    
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


class MobilePhoneDetailSerializer(MobilePhoneSerializer):
    """Detailed serializer for MobilePhone with brand details"""
    brand_details = BrandSerializer(source='brand', read_only=True)

    class Meta(MobilePhoneSerializer.Meta):
        fields = MobilePhoneSerializer.Meta.fields + ['brand_details']
