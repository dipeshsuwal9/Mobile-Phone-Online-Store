from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Customer
from .serializers import CustomerSerializer, CustomerRegistrationSerializer, ChangePasswordSerializer


class CustomerRegistrationView(generics.CreateAPIView):
    """View for customer registration"""
    queryset = Customer.objects.all()
    serializer_class = CustomerRegistrationSerializer
    permission_classes = [AllowAny]


class CustomerLoginView(TokenObtainPairView):
    """View for customer login using JWT"""
    permission_classes = [AllowAny]


class CustomerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Customer operations
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Non-admin users can only see their own profile
        if self.request.user.is_staff:
            return Customer.objects.all()
        return Customer.objects.filter(customer_id=self.request.user.customer_id)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        """Update current user profile"""
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change password for current user"""
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {"old_password": "Wrong password."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)
