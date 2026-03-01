# backend/apps/accounts/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid

class User(AbstractUser):
    """Custom User Model"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, blank=True)
    display_name = models.CharField(max_length=255, blank=True)
    picture = models.TextField(blank=True, null=True)  # Profile picture URL
    photo = models.TextField(blank=True, null=True)
    
    # Google specific fields
    google_id = models.CharField(max_length=255, blank=True, null=True)
    has_real_google_picture = models.BooleanField(default=False)
    
    # Provider info
    provider = models.CharField(max_length=50, default='email')  # email, google
    provider_id = models.CharField(max_length=50, default='email')
    
    # Verification
    email_verified = models.BooleanField(default=False)
    
    # Timestamps
    login_time = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Vendor specific
    is_vendor = models.BooleanField(default=False)
    shop_name = models.CharField(max_length=255, blank=True, null=True)
    business_type = models.CharField(max_length=100, blank=True, null=True)
    whatsapp_number = models.CharField(max_length=20, blank=True, null=True)
    
    # Location
    country = models.CharField(max_length=100, default='Tanzania')
    region = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    area = models.CharField(max_length=100, blank=True, null=True)
    street = models.CharField(max_length=255, blank=True, null=True)
    map_location = models.TextField(blank=True, null=True)
    
    # Shop hours
    opening_hours = models.CharField(max_length=255, blank=True, null=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
        
    def __str__(self):
        return self.email

class VendorRegistration(models.Model):
    """Vendor Registration Details"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vendor_registrations')
    
    # Shop details
    shop_name = models.CharField(max_length=255)
    business_type = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='Tanzania')
    region = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    street = models.CharField(max_length=255, blank=True, null=True)
    map_location = models.TextField(blank=True, null=True)
    opening_hours = models.CharField(max_length=255, blank=True, null=True)
    whatsapp_number = models.CharField(max_length=20)
    
    # Contact info
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField()
    
    # Main category
    main_category = models.CharField(max_length=100)
    
    # Shop image
    shop_image = models.TextField(blank=True, null=True)
    
    # Status
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    registration_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'vendor_registrations'
        
    def __str__(self):
        return f"{self.shop_name} - {self.user.email}"