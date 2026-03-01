from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Ad
from .serializers import AdSerializer

class AdListCreateView(generics.ListCreateAPIView):
    """List all ads or create a new ad"""
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class AdDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete an ad"""
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_active_ads(request):
    """Get all active ads"""
    ads = Ad.objects.filter(active=True)
    serializer = AdSerializer(ads, many=True)
    
    return Response({
        'success': True,
        'count': ads.count(),
        'ads': serializer.data
    })

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def toggle_ad_status(request, ad_id):
    """Toggle ad active status"""
    try:
        ad = Ad.objects.get(id=ad_id)
        ad.active = not ad.active
        ad.save()
        
        return Response({
            'success': True,
            'active': ad.active,
            'message': f'Ad {"activated" if ad.active else "deactivated"}'
        })
    except Ad.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Ad not found'
        }, status=status.HTTP_404_NOT_FOUND)