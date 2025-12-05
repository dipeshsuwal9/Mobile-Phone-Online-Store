from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model"""
    order_id = serializers.IntegerField(source='order.order_id', read_only=True)
    customer_name = serializers.CharField(source='order.customer.name', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'payment_id', 'order', 'order_id', 'customer_name', 'amount',
            'payment_method', 'payment_date', 'status', 'transaction_id',
            'notes', 'updated_at'
        ]
        read_only_fields = ['payment_id', 'payment_date', 'updated_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")
        return value


class CreatePaymentSerializer(serializers.Serializer):
    """Serializer for creating payment"""
    order_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=Payment.PAYMENT_METHOD_CHOICES)
    transaction_id = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
