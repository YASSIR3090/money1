from django.db import models
from django.conf import settings
import uuid

class Shop(models.Model):
    """Shop Model"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='shops')
    
    # Shop info
    shop_name = models.CharField(max_length=255)
    seller_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    whatsapp_number = models.CharField(max_length=20, blank=True, null=True)
    
    # Images
    shop_image = models.TextField(blank=True, null=True)
    product_image = models.TextField(blank=True, null=True)
    
    # Location
    country = models.CharField(max_length=100, default='Tanzania')
    region = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    street = models.CharField(max_length=255, blank=True, null=True)
    map_location = models.TextField(blank=True, null=True)
    
    # Business info
    main_category = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    opening_hours = models.CharField(max_length=255, blank=True, null=True)
    
    # Stats
    rating = models.FloatField(default=0.0)
    reviews = models.IntegerField(default=0)
    products_count = models.IntegerField(default=0)
    
    # Status
    is_verified = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'shops'
        
    def __str__(self):
        return f"{self.shop_name} - {self.owner.email}"