from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer, AddToCartSerializer


class CartViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Cart operations
    """
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(customer=self.request.user)

    def get_or_create_cart(self):
        """Get or create cart for current user"""
        cart, created = Cart.objects.get_or_create(customer=self.request.user)
        return cart

    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        """Get current user's cart"""
        cart = self.get_or_create_cart()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to cart"""
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = self.get_or_create_cart()
        product_type = serializer.validated_data['product_type']
        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']

        # Check if item already exists in cart
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product_type=product_type,
            product_id=product_id,
            defaults={'quantity': quantity}
        )

        if not created:
            # Update quantity if item already exists
            cart_item.quantity += quantity
            cart_item.save()

        cart_serializer = self.get_serializer(cart)
        return Response(cart_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['patch'])
    def update_item(self, request):
        """Update item quantity in cart"""
        cart_item_id = request.data.get('cart_item_id')
        quantity = request.data.get('quantity')

        if not cart_item_id or quantity is None:
            return Response(
                {"error": "cart_item_id and quantity are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cart = self.get_or_create_cart()
            cart_item = CartItem.objects.get(cart_item_id=cart_item_id, cart=cart)
            cart_item.quantity = quantity
            cart_item.save()

            cart_serializer = self.get_serializer(cart)
            return Response(cart_serializer.data)
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        """Remove item from cart"""
        cart_item_id = request.query_params.get('cart_item_id')

        if not cart_item_id:
            return Response(
                {"error": "cart_item_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cart = self.get_or_create_cart()
            cart_item = CartItem.objects.get(cart_item_id=cart_item_id, cart=cart)
            cart_item.delete()

            cart_serializer = self.get_serializer(cart)
            return Response(cart_serializer.data)
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['delete'])
    def clear_cart(self, request):
        """Clear all items from cart"""
        cart = self.get_or_create_cart()
        cart.items.all().delete()

        cart_serializer = self.get_serializer(cart)
        return Response(cart_serializer.data)
