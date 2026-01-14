from django.contrib import admin
from .models import User, UserDocument, JobApplication, UserMessage

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'last_name', 'phone_number', 'registration_date', 'is_active']
    list_filter = ['gender', 'marital_status', 'is_active', 'registration_date']
    search_fields = ['email', 'first_name', 'last_name', 'phone_number', 'id_number']
    readonly_fields = ['registration_date']

@admin.register(UserDocument)
class UserDocumentAdmin(admin.ModelAdmin):
    list_display = ['user', 'document_type', 'uploaded_at']
    list_filter = ['document_type', 'uploaded_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['uploaded_at']

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['user', 'job_title', 'status', 'application_date']
    list_filter = ['status', 'application_date']
    search_fields = ['user__email', 'job_title']
    readonly_fields = ['application_date']

@admin.register(UserMessage)
class UserMessageAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'admin_reply']
    list_filter = ['created_at']
    search_fields = ['user__email', 'message']
    readonly_fields = ['created_at']