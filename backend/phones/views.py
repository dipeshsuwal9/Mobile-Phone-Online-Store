from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Brand, MobilePhone
from .serializers import BrandSerializer, MobilePhoneSerializer, MobilePhoneDetailSerializer


class BrandViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Brand CRUD operations
    List, Create, Retrieve, Update, Delete brands
    """
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['brand_name', 'country_of_origin']
    ordering_fields = ['brand_name', 'created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]


class MobilePhoneViewSet(viewsets.ModelViewSet):
    """
    ViewSet for MobilePhone CRUD operations
    List, Create, Retrieve, Update, Delete mobile phones
    """
    queryset = MobilePhone.objects.select_related('brand').all()
    serializer_class = MobilePhoneSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['brand', 'os', 'ram', 'storage']
    search_fields = ['model_name', 'brand__brand_name', 'processor']
    ordering_fields = ['price', 'created_at', 'stock_quantity']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return MobilePhoneDetailSerializer
        return MobilePhoneSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]
