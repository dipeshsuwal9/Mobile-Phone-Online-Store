from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['payment_id', 'order', 'amount', 'payment_method', 'status', 'payment_date']
    list_filter = ['status', 'payment_method', 'payment_date']
    search_fields = ['payment_id', 'order__order_id', 'transaction_id', 'order__customer__name']
    readonly_fields = ['payment_id', 'payment_date', 'updated_at']
    list_editable = ['status']
