from django.db import models
from django.conf import settings
from phones.models import MobilePhone
from accessories.models import Accessory


class Cart(models.Model):
    """Model for customer shopping cart"""
    cart_id = models.AutoField(primary_key=True)
    customer = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Cart'
        verbose_name_plural = 'Carts'

    def __str__(self):
        return f"Cart for {self.customer.name}"

    @property
    def total_items(self):
        return self.items.count()

    @property
    def total_amount(self):
        total = 0
        for item in self.items.all():
            total += item.subtotal
        return total


class CartItem(models.Model):
    """Model for items in shopping cart"""
    PRODUCT_TYPE_CHOICES = [
        ('PHONE', 'Mobile Phone'),
        ('ACCESSORY', 'Accessory'),
    ]

    cart_item_id = models.AutoField(primary_key=True)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPE_CHOICES)
    product_id = models.IntegerField()
    quantity = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Cart Item'
        verbose_name_plural = 'Cart Items'
        unique_together = ['cart', 'product_type', 'product_id']

    def __str__(self):
        return f"{self.product_type} - {self.product_id} (x{self.quantity})"

    @property
    def product(self):
        """Get the actual product object"""
        if self.product_type == 'PHONE':
            return MobilePhone.objects.filter(phone_id=self.product_id).first()
        elif self.product_type == 'ACCESSORY':
            return Accessory.objects.filter(accessory_id=self.product_id).first()
        return None

    @property
    def product_name(self):
        """Get product name"""
        product = self.product
        if product:
            if self.product_type == 'PHONE':
                return f"{product.brand.brand_name} {product.model_name}"
            return product.name
        return "Product not found"

    @property
    def unit_price(self):
        """Get unit price of the product"""
        product = self.product
        return product.price if product else 0

    @property
    def subtotal(self):
        """Calculate subtotal for this item"""
        return self.unit_price * self.quantity
