from django.contrib import admin
from .models import Brand, MobilePhone


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['brand_id', 'brand_name', 'country_of_origin', 'created_at']
    search_fields = ['brand_name', 'country_of_origin']
    list_filter = ['country_of_origin', 'created_at']


@admin.register(MobilePhone)
class MobilePhoneAdmin(admin.ModelAdmin):
    list_display = ['phone_id', 'brand', 'model_name', 'price', 'stock_quantity', 'os', 'created_at']
    search_fields = ['model_name', 'brand__brand_name', 'processor']
    list_filter = ['brand', 'os', 'ram', 'storage', 'created_at']
    list_editable = ['price', 'stock_quantity']
    readonly_fields = ['created_at', 'updated_at']
