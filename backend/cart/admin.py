from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['product_name', 'unit_price', 'subtotal']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['cart_id', 'customer', 'total_items', 'total_amount', 'created_at']
    search_fields = ['customer__name', 'customer__email']
    readonly_fields = ['total_items', 'total_amount', 'created_at', 'updated_at']
    inlines = [CartItemInline]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart_item_id', 'cart', 'product_type', 'product_id', 'quantity', 'subtotal']
    list_filter = ['product_type', 'created_at']
    readonly_fields = ['product_name', 'unit_price', 'subtotal']
