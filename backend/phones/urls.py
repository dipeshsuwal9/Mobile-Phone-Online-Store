from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BrandViewSet, MobilePhoneViewSet

router = DefaultRouter()
router.register(r'brands', BrandViewSet, basename='brand')
router.register(r'', MobilePhoneViewSet, basename='phone')

urlpatterns = [
    path('', include(router.urls)),
]
