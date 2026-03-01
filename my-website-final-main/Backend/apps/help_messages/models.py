from django.db import models
from django.conf import settings
import uuid

class HelpMessage(models.Model):
    """Help Center Message Model"""
    STATUS_CHOICES = [
        ('unread', 'Unread'),
        ('read', 'Read'),
        ('replied', 'Replied'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Sender info
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Message
    message = models.TextField()
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unread')
    
    # Replies
    replies = models.JSONField(default=list, blank=True)  # List of reply objects
    
    # Admin notes
    admin_notes = models.TextField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'help_messages'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Message from {self.name} - {self.status}"