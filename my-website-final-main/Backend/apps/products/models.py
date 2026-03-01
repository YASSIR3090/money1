# backend/apps/products/models.py - WITH INDEXES 🔥
from django.db import models
from django.conf import settings
import uuid
import json

class Product(models.Model):
    """Product Model - PUBLIC ACCESS KAMILI"""
    
    STOCK_STATUS = [
        ('Available', 'Available'),
        ('Limited', 'Limited'),
        ('Out of Stock', 'Out of Stock'),
    ]
    
    CONDITION_CHOICES = [
        ('New', 'New'),
        ('Used - Like New', 'Used - Like New'),
        ('Used - Good', 'Used - Good'),
        ('Used - Fair', 'Used - Fair'),
        ('Refurbished', 'Refurbished'),
    ]
    
    PRICE_TYPE = [
        ('Fixed', 'Fixed'),
        ('Negotiable', 'Negotiable'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Seller
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='products',
        null=True,
        blank=True,
        default=None
    )
    
    # Basic info
    product_name = models.CharField(max_length=255, blank=True, null=True, default='')
    shop_name = models.CharField(max_length=255, blank=True, null=True, default='')
    seller_name = models.CharField(max_length=255, blank=True, null=True, default='')
    
    # Business info
    business_type = models.CharField(max_length=100, blank=True, null=True, default='')
    profile_picture = models.TextField(blank=True, null=True, default='')
    
    # Category
    main_category = models.CharField(max_length=100, blank=True, null=True, default='')
    product_category = models.CharField(max_length=100, blank=True, null=True, default='')
    sub_category = models.CharField(max_length=100, blank=True, null=True, default='')
    
    # Brand
    brand = models.CharField(max_length=100, blank=True, null=True, default='')
    
    # Description
    description = models.TextField(blank=True, null=True, default='')
    specifications = models.TextField(blank=True, null=True, default='')
    
    # Images
    product_images = models.JSONField(default=list, blank=True, null=True)
    shop_image = models.TextField(blank=True, null=True, default='')
    
    # Price
    price = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True, default=0)
    currency = models.CharField(max_length=10, default='TZS', blank=True, null=True)
    price_type = models.CharField(max_length=20, choices=PRICE_TYPE, default='Fixed', blank=True, null=True)
    
    # Stock
    stock_status = models.CharField(max_length=20, choices=STOCK_STATUS, default='Available', blank=True, null=True)
    quantity_available = models.IntegerField(default=0, blank=True, null=True)
    
    # Condition
    condition = models.CharField(max_length=50, choices=CONDITION_CHOICES, default='New', blank=True, null=True)
    
    # Warranty
    warranty = models.CharField(max_length=10, blank=True, null=True, default='No')
    warranty_period = models.CharField(max_length=100, blank=True, null=True, default='')
    
    # Fashion specific
    size = models.CharField(max_length=50, blank=True, null=True, default='')
    color = models.CharField(max_length=50, blank=True, null=True, default='')
    material = models.CharField(max_length=100, blank=True, null=True, default='')
    
    # Location
    country = models.CharField(max_length=100, default='Tanzania', blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True, default='')
    district = models.CharField(max_length=100, blank=True, null=True, default='')
    area = models.CharField(max_length=100, blank=True, null=True, default='')
    street = models.CharField(max_length=255, blank=True, null=True, default='')
    map_location = models.TextField(blank=True, null=True, default='')
    
    # Contact
    phone_number = models.CharField(max_length=20, blank=True, null=True, default='')
    whatsapp_number = models.CharField(max_length=20, blank=True, null=True, default='')
    email = models.EmailField(blank=True, null=True, default='')
    
    # Features
    features = models.JSONField(default=list, blank=True, null=True)
    
    # Status
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    registration_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'products'
        ordering = ['-registration_date']
        
        # ============== 🔥 INDEXES ZA POSTGRESQL - MUHIMU SANA! ==============
        indexes = [
            models.Index(fields=['-registration_date'], name='idx_reg_date_desc'),
            models.Index(fields=['email'], name='idx_email'),
            models.Index(fields=['is_active'], name='idx_is_active'),
            models.Index(fields=['main_category'], name='idx_main_category'),
            models.Index(fields=['product_category'], name='idx_product_category'),
            models.Index(fields=['brand'], name='idx_brand'),
            models.Index(fields=['price'], name='idx_price'),
            models.Index(fields=['region'], name='idx_region'),
            models.Index(fields=['district'], name='idx_district'),
            models.Index(fields=['is_active', '-registration_date'], name='idx_active_date'),
            models.Index(fields=['main_category', 'is_active'], name='idx_category_active'),
        ]
        
    def __str__(self):
        return f"{self.product_name or 'Product'} - {self.email or 'No email'}"
    
    def save(self, *args, **kwargs):
        """Override save to ensure no NULL values and fix images"""
        # Set defaults for None values
        if self.product_name is None:
            self.product_name = ''
        if self.business_type is None:
            self.business_type = ''
        if self.profile_picture is None:
            self.profile_picture = ''
        if self.price is None:
            self.price = 0
        if self.country is None:
            self.country = 'Tanzania'
        
        # Fix product_images if it's a string
        if hasattr(self, 'product_images') and self.product_images is not None:
            if isinstance(self.product_images, str):
                try:
                    self.product_images = json.loads(self.product_images)
                    print(f"✅ Fixed product_images from string to list: {len(self.product_images)} images")
                except:
                    self.product_images = [self.product_images]
                    print(f"✅ Fixed product_images as single image string")
            
            # Ensure product_images is a list
            if not isinstance(self.product_images, list):
                self.product_images = [self.product_images] if self.product_images else []
        else:
            self.product_images = []
        
        print(f"💾 Saving product {self.product_name} with {len(self.product_images)} images")
        
        super().save(*args, **kwargs)