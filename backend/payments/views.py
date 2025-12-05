from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from .serializers import PaymentSerializer, CreatePaymentSerializer
from orders.models import Order


class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Payment operations
    """
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Non-admin users can only see payments for their own orders
        if self.request.user.is_staff:
            return Payment.objects.all()
        return Payment.objects.filter(order__customer=self.request.user)

    @action(detail=False, methods=['post'])
    def create_payment(self, request):
        """Create payment for an order"""
        serializer = CreatePaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        order_id = serializer.validated_data['order_id']

        try:
            order = Order.objects.get(order_id=order_id)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if user owns this order
        if not request.user.is_staff and order.customer != request.user:
            return Response(
                {"error": "You don't have permission to pay for this order"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if order is already paid
        if order.payments.filter(status='COMPLETED').exists():
            return Response(
                {"error": "Order is already paid"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create payment
        payment = Payment.objects.create(
            order=order,
            amount=order.total_amount,
            payment_method=serializer.validated_data['payment_method'],
            transaction_id=serializer.validated_data.get('transaction_id', ''),
            notes=serializer.validated_data.get('notes', ''),
            status='COMPLETED'  # In real app, this would be PENDING until payment gateway confirms
        )

        # Update order status
        if payment.status == 'COMPLETED':
            order.status = 'CONFIRMED'
            order.save()

        payment_serializer = self.get_serializer(payment)
        return Response(payment_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update payment status (admin only)"""
        if not request.user.is_staff:
            return Response(
                {"error": "Only administrators can update payment status"},
                status=status.HTTP_403_FORBIDDEN
            )

        payment = self.get_object()
        new_status = request.data.get('status')

        if not new_status:
            return Response(
                {"error": "Status is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment.status = new_status
        payment.save()

        # Update order status based on payment status
        if new_status == 'COMPLETED':
            payment.order.status = 'CONFIRMED'
            payment.order.save()
        elif new_status == 'FAILED':
            payment.order.status = 'PENDING'
            payment.order.save()

        serializer = self.get_serializer(payment)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_payments(self, request):
        """Get current user's payments"""
        payments = self.get_queryset().filter(order__customer=request.user)
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data)
