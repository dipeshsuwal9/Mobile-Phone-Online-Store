from django.contrib import admin
from .models import Accessory


@admin.register(Accessory)
class AccessoryAdmin(admin.ModelAdmin):
    list_display = ['accessory_id', 'name', 'category', 'price', 'stock_quantity', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['category', 'created_at']
    list_editable = ['price', 'stock_quantity']
    readonly_fields = ['created_at', 'updated_at']
