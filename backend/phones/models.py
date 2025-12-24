from django.db import models


class Brand(models.Model):
    """Model for mobile phone brands"""
    brand_id = models.AutoField(primary_key=True)
    brand_name = models.CharField(max_length=100, unique=True)
    country_of_origin = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['brand_name']
        verbose_name = 'Brand'
        verbose_name_plural = 'Brands'

    def __str__(self):
        return self.brand_name


class MobilePhone(models.Model):
    """Model for mobile phones"""
    OS_CHOICES = [
        ('Android', 'Android'),
        ('iOS', 'iOS'),
        ('HarmonyOS', 'HarmonyOS'),
        ('Other', 'Other'),
    ]

    phone_id = models.AutoField(primary_key=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='phones')
    model_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    ram = models.CharField(max_length=50)  # e.g., "8GB", "12GB"
    storage = models.CharField(max_length=50)  # e.g., "128GB", "256GB"
    battery_capacity = models.CharField(max_length=50)  # e.g., "5000mAh"
    processor = models.CharField(max_length=200)
    os = models.CharField(max_length=50, choices=OS_CHOICES)
    description = models.TextField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True, help_text='Image URL (optional if image file is uploaded)')
    image = models.ImageField(upload_to='phones/', blank=True, null=True, help_text='Upload image file (optional if image URL is provided)')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Mobile Phone'
        verbose_name_plural = 'Mobile Phones'
        unique_together = ['brand', 'model_name']

    def __str__(self):
        return f"{self.brand.brand_name} {self.model_name}"
    
    def get_image_url(self):
        """Return image URL from either uploaded file or URL field"""
        if self.image:
            return self.image.url
        return self.image_url

    @property
    def is_in_stock(self):
        return self.stock_quantity > 0
