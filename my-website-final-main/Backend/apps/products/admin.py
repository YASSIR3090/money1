# backend/apps/products/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'email', 'price', 'image_preview', 'registration_date', 'is_active')
    list_filter = ('is_active', 'main_category', 'registration_date')
    search_fields = ('product_name', 'email', 'phone_number', 'whatsapp_number')
    readonly_fields = ('id', 'registration_date', 'last_updated', 'image_preview_detail')
    
    fieldsets = (
        ('Product Information', {
            'fields': ('product_name', 'shop_name', 'seller_name', 'business_type')
        }),
        ('Contact', {
            'fields': ('email', 'phone_number', 'whatsapp_number')
        }),
        ('Price', {
            'fields': ('price', 'currency', 'price_type')
        }),
        ('Details', {
            'fields': ('description', 'main_category', 'product_category', 'brand')
        }),
        ('Images', {
            'fields': ('image_preview_detail', 'product_images', 'shop_image', 'profile_picture')
        }),
        ('Status', {
            'fields': ('is_active', 'is_verified')
        }),
        ('Timestamps', {
            'fields': ('registration_date', 'last_updated')
        }),
    )
    
    def image_preview(self, obj):
        """Show first product image thumbnail in list view"""
        if obj.product_images and len(obj.product_images) > 0:
            first_image = obj.product_images[0]
            if first_image and isinstance(first_image, str):
                if first_image.startswith('data:image'):
                    # Base64 image - show as small thumbnail
                    return format_html(
                        '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />',
                        first_image
                    )
                else:
                    # URL image
                    return format_html(
                        '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />',
                        first_image
                    )
        return format_html('<span style="color: #999;">No image</span>')
    
    image_preview.short_description = 'Image'
    
    def image_preview_detail(self, obj):
        """Show all images in detail view"""
        if not obj.product_images or len(obj.product_images) == 0:
            return format_html('<p style="color: #999;">No images uploaded</p>')
        
        html = '<div style="display: flex; flex-wrap: wrap; gap: 10px;">'
        for i, img in enumerate(obj.product_images):
            if img and isinstance(img, str):
                if img.startswith('data:image'):
                    # Base64 image
                    html += format_html(
                        '<div style="border: 1px solid #ddd; padding: 5px; border-radius: 5px;">'
                        '<img src="{}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 5px;" />'
                        '<p style="text-align: center; margin: 5px 0 0;">Image {}</p>'
                        '</div>',
                        img, i+1
                    )
                else:
                    # URL image
                    html += format_html(
                        '<div style="border: 1px solid #ddd; padding: 5px; border-radius: 5px;">'
                        '<img src="{}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 5px;" />'
                        '<p style="text-align: center; margin: 5px 0 0;">Image {}</p>'
                        '</div>',
                        img, i+1
                    )
        html += '</div>'
        return format_html(html)
    
    image_preview_detail.short_description = 'Product Images'