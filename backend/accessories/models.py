from django.db import models


class Accessory(models.Model):
    """Model for mobile phone accessories"""
    CATEGORY_CHOICES = [
        ('Case', 'Phone Case'),
        ('Charger', 'Charger'),
        ('Earphones', 'Earphones'),
        ('Screen Protector', 'Screen Protector'),
        ('Power Bank', 'Power Bank'),
        ('Cable', 'Cable'),
        ('Other', 'Other'),
    ]

    accessory_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Other')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    description = models.TextField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Accessory'
        verbose_name_plural = 'Accessories'

    def __str__(self):
        return self.name

    @property
    def is_in_stock(self):
        return self.stock_quantity > 0
