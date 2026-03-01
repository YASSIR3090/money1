from django.contrib import admin
from .models import HelpMessage

@admin.register(HelpMessage)
class HelpMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at')
    search_fields = ('name', 'email', 'message', 'phone')
    readonly_fields = ('id', 'created_at', 'updated_at')
    fieldsets = (
        ('Sender Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Message', {
            'fields': ('message', 'status', 'replies', 'admin_notes')
        }),
        ('User Reference', {
            'fields': ('user',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def get_replies_count(self, obj):
        return len(obj.replies) if obj.replies else 0
    get_replies_count.short_description = 'Replies'
    list_display = ('name', 'email', 'status', 'get_replies_count', 'created_at')