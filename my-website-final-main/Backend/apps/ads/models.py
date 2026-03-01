from django.db import models
import uuid

class Ad(models.Model):
    """Carousel Ad Model"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Ad content
    image = models.TextField()  # Base64 encoded image
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    
    # Colors
    background_color = models.CharField(max_length=20, default='#FF6B6B')
    text_color = models.CharField(max_length=20, default='#ffffff')
    nav_color = models.CharField(max_length=20, default='#FF6B6B')
    
    # Status
    active = models.BooleanField(default=True)
    
    # Order
    order = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ads'
        ordering = ['order', '-created_at']
        
    def __str__(self):
        return f"Ad {self.id} - {'Active' if self.active else 'Inactive'}"