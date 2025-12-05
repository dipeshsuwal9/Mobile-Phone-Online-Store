from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'price_at_purchase', 'subtotal']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'customer', 'order_date', 'status', 'total_amount', 'total_items']
    list_filter = ['status', 'order_date']
    search_fields = ['order_id', 'customer__name', 'customer__email']
    readonly_fields = ['order_id', 'order_date', 'total_items', 'updated_at']
    inlines = [OrderItemInline]
    list_editable = ['status']


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order_item_id', 'order', 'product_type', 'product_name', 'quantity', 'price_at_purchase', 'subtotal']
    list_filter = ['product_type', 'created_at']
    readonly_fields = ['subtotal', 'created_at']
