from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
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
    parser_classes = [MultiPartParser, FormParser, JSONParser]
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

    def get_queryset(self):
        """Ensure fresh data is always fetched from database"""
        return MobilePhone.objects.select_related('brand').all().order_by('-updated_at')

    def _add_no_cache_headers(self, response):
        """Add comprehensive no-cache headers to response"""
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        response['ETag'] = None
        response['Last-Modified'] = None
        return response

    @method_decorator(never_cache)
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return self._add_no_cache_headers(response)

    @method_decorator(never_cache)
    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return self._add_no_cache_headers(response)

    @method_decorator(never_cache)
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return self._add_no_cache_headers(response)

    @method_decorator(never_cache)
    def partial_update(self, request, *args, **kwargs):
        response = super().partial_update(request, *args, **kwargs)
        return self._add_no_cache_headers(response)
