from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import HelpMessage
from .serializers import HelpMessageSerializer, ReplySerializer
import uuid
from datetime import datetime

class MessageListCreateView(generics.ListCreateAPIView):
    """List all messages or create a new message"""
    queryset = HelpMessage.objects.all()
    serializer_class = HelpMessageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        message = serializer.save(
            id=uuid.uuid4(),
            status='unread'
        )

class MessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a message"""
    queryset = HelpMessage.objects.all()
    serializer_class = HelpMessageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def reply_to_message(request, message_id):
    """Reply to a help message"""
    try:
        message = HelpMessage.objects.get(id=message_id)
    except HelpMessage.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Message not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ReplySerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    reply = {
        'id': str(uuid.uuid4()),
        'text': serializer.validated_data['text'],
        'admin_email': serializer.validated_data['admin_email'],
        'created_at': datetime.now().isoformat()
    }
    
    # Add reply to message
    replies = message.replies or []
    replies.append(reply)
    message.replies = replies
    message.status = 'replied'
    message.save()
    
    return Response({
        'success': True,
        'reply': reply,
        'message': 'Reply sent successfully'
    })

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def mark_message_read(request, message_id):
    """Mark message as read"""
    try:
        message = HelpMessage.objects.get(id=message_id)
        message.status = 'read'
        message.save()
        
        return Response({
            'success': True,
            'status': 'read'
        })
    except HelpMessage.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Message not found'
        }, status=status.HTTP_404_NOT_FOUND)