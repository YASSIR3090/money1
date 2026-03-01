# backend/apps/accounts/admin.py
from django.contrib import admin
from .models import User, VendorRegistration

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'provider', 'is_vendor', 'is_active', 'created_at')
    list_filter = ('provider', 'is_vendor', 'is_active', 'created_at')
    search_fields = ('email', 'name', 'shop_name')
    readonly_fields = ('id', 'created_at', 'updated_at', 'login_time')
    
    fieldsets = (
        ('Authentication', {
            'fields': ('email', 'password', 'provider', 'provider_id', 'google_id')
        }),
        ('Personal Info', {
            'fields': ('name', 'display_name', 'picture', 'photo', 'has_real_google_picture')
        }),
        ('Vendor Info', {
            'fields': ('is_vendor', 'shop_name', 'business_type', 'whatsapp_number')
        }),
        ('Location', {
            'fields': ('country', 'region', 'district', 'area', 'street', 'map_location')
        }),
        ('Shop Hours', {
            'fields': ('opening_hours',)
        }),
        ('Status', {
            'fields': ('is_active', 'email_verified', 'is_staff', 'is_superuser')
        }),
        ('Timestamps', {
            'fields': ('login_time', 'created_at', 'updated_at', 'last_login', 'date_joined')
        }),
    )

@admin.register(VendorRegistration)
class VendorRegistrationAdmin(admin.ModelAdmin):
    list_display = ('shop_name', 'user', 'main_category', 'is_verified', 'registration_date')
    list_filter = ('is_verified', 'main_category', 'country', 'region')
    search_fields = ('shop_name', 'user__email', 'whatsapp_number', 'email')
    readonly_fields = ('id', 'registration_date', 'last_updated')
    raw_id_fields = ('user',)