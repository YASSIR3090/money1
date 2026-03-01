from django.contrib import admin
from .models import Shop

@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ('shop_name', 'seller_name', 'main_category', 'rating', 'is_verified', 'is_active', 'created_at')
    list_filter = ('main_category', 'is_verified', 'is_active', 'country', 'region')
    search_fields = ('shop_name', 'seller_name', 'email', 'description')
    readonly_fields = ('id', 'created_at', 'updated_at')
    fieldsets = (
        ('Shop Information', {
            'fields': ('shop_name', 'seller_name', 'email', 'phone_number', 'whatsapp_number')
        }),
        ('Location', {
            'fields': ('country', 'region', 'district', 'area', 'street', 'map_location')
        }),
        ('Business Details', {
            'fields': ('main_category', 'description', 'opening_hours')
        }),
        ('Images', {
            'fields': ('shop_image', 'product_image')
        }),
        ('Statistics', {
            'fields': ('rating', 'reviews', 'products_count')
        }),
        ('Status', {
            'fields': ('is_verified', 'is_featured', 'is_active')
        }),
        ('Owner', {
            'fields': ('owner',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )