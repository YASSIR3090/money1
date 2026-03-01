from django.contrib import admin
from .models import Ad

@admin.register(Ad)
class AdAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'active', 'order', 'created_at')
    list_filter = ('active', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('id', 'created_at', 'updated_at')
    fieldsets = (
        ('Ad Content', {
            'fields': ('image', 'title', 'description', 'link')
        }),
        ('Colors', {
            'fields': ('background_color', 'text_color', 'nav_color')
        }),
        ('Settings', {
            'fields': ('active', 'order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )