from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomerViewSet, CustomerRegistrationView, CustomerLoginView

router = DefaultRouter()
router.register(r'profiles', CustomerViewSet, basename='customer')

urlpatterns = [
    path('register/', CustomerRegistrationView.as_view(), name='customer-register'),
    path('login/', CustomerLoginView.as_view(), name='customer-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('', include(router.urls)),
]
