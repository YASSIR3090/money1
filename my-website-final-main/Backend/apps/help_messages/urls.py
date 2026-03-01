from django.urls import path
from . import views

urlpatterns = [
    path('', views.MessageListCreateView.as_view(), name='message-list'),
    path('<uuid:pk>/', views.MessageDetailView.as_view(), name='message-detail'),
    path('<uuid:message_id>/reply/', views.reply_to_message, name='message-reply'),
    path('<uuid:message_id>/read/', views.mark_message_read, name='message-read'),
]