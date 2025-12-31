from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    """Serializer for Customer model"""
    
    class Meta:
        model = Customer
        fields = ['customer_id', 'name', 'email', 'phone', 'address', 'date_joined']
        read_only_fields = ['customer_id', 'date_joined']


class CustomerRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for customer registration"""
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'},
        help_text='Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
    )
    password2 = serializers.CharField(
        write_only=True, 
        required=True,
        style={'input_type': 'password'},
        help_text='Enter the same password as before, for verification'
    )
    
    # Make phone and address truly optional
    phone = serializers.CharField(
        required=False, 
        allow_blank=True,
        help_text='Phone number (optional)'
    )
    address = serializers.CharField(
        required=False, 
        allow_blank=True,
        help_text='Full address (optional)'
    )

    class Meta:
        model = Customer
        fields = ['name', 'email', 'phone', 'address', 'password', 'password2']
        extra_kwargs = {
            'name': {'required': True},
            'email': {'required': True},
        }

    def validate(self, attrs):
        """Validate password match"""
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password2": "Password fields didn't match."
            })
        return attrs
    
    def validate_email(self, value):
        """Validate email uniqueness"""
        if Customer.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists. Please use a different email or try logging in."
            )
        return value

    def create(self, validated_data):
        """Create new customer"""
        # Remove password2 from validated data
        validated_data.pop('password2')
        
        # Get optional fields with defaults
        phone = validated_data.pop('phone', '').strip()
        address = validated_data.pop('address', '').strip()
        
        # Create user with required fields
        user = Customer.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            phone=phone if phone else '',
            address=address if address else ''
        )
        return user


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(
        required=True, 
        write_only=True, 
        validators=[validate_password]
    )
    
    def validate_new_password(self, value):
        """Validate new password"""
        validate_password(value)
        return value


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT serializer that accepts email instead of username"""
    username_field = 'email'
