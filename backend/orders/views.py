from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db import transaction
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from cart.models import Cart


class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Order operations
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Non-admin users can only see their own orders
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(customer=self.request.user)

    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Get current user's orders"""
        orders = self.get_queryset().filter(customer=request.user)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def create_from_cart(self, request):
        """Create order from cart"""
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            cart = Cart.objects.get(customer=request.user)
        except Cart.DoesNotExist:
            return Response(
                {"error": "Cart not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if cart.items.count() == 0:
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create order in a transaction
        with transaction.atomic():
            # Calculate total
            total = cart.total_amount

            # Create order
            order = Order.objects.create(
                customer=request.user,
                total_amount=total,
                shipping_address=serializer.validated_data['shipping_address'],
                notes=serializer.validated_data.get('notes', ''),
                status='PENDING'
            )

            # Create order items from cart items
            for cart_item in cart.items.all():
                product = cart_item.product
                if not product:
                    raise ValueError(f"Product not found for cart item {cart_item.cart_item_id}")

                # Check stock availability
                if product.stock_quantity < cart_item.quantity:
                    raise ValueError(f"Insufficient stock for {cart_item.product_name}")

                # Create order item
                OrderItem.objects.create(
                    order=order,
                    product_type=cart_item.product_type,
                    product_id=cart_item.product_id,
                    product_name=cart_item.product_name,
                    quantity=cart_item.quantity,
                    price_at_purchase=cart_item.unit_price
                )

                # Update stock
                product.stock_quantity -= cart_item.quantity
                product.save()

            # Clear cart
            cart.items.all().delete()

        order_serializer = self.get_serializer(order)
        return Response(order_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update order status (admin only)"""
        if not request.user.is_staff:
            return Response(
                {"error": "Only administrators can update order status"},
                status=status.HTTP_403_FORBIDDEN
            )

        order = self.get_object()
        new_status = request.data.get('status')

        if not new_status:
            return Response(
                {"error": "Status is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        order.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel order"""
        order = self.get_object()

        if order.status in ['SHIPPED', 'DELIVERED', 'CANCELLED']:
            return Response(
                {"error": f"Cannot cancel order with status {order.status}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Restore stock
        with transaction.atomic():
            for item in order.items.all():
                if item.product_type == 'PHONE':
                    from phones.models import MobilePhone
                    product = MobilePhone.objects.filter(phone_id=item.product_id).first()
                elif item.product_type == 'ACCESSORY':
                    from accessories.models import Accessory
                    product = Accessory.objects.filter(accessory_id=item.product_id).first()
                else:
                    continue

                if product:
                    product.stock_quantity += item.quantity
                    product.save()

            order.status = 'CANCELLED'
            order.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data)
