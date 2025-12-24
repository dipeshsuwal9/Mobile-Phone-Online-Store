from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from .models import Accessory
from .serializers import AccessorySerializer


class AccessoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Accessory CRUD operations
    List, Create, Retrieve, Update, Delete accessories
    """
    queryset = Accessory.objects.all()
    serializer_class = AccessorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'stock_quantity']

    def get_queryset(self):
        """Ensure fresh data is always fetched from database"""
        return Accessory.objects.all().order_by('-updated_at')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]

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
