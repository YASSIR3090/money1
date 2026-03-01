from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from .models import Shop
from .serializers import ShopSerializer
from apps.products.models import Product
import uuid

class ShopListCreateView(generics.ListCreateAPIView):
    """List all shops or create a new shop"""
    queryset = Shop.objects.filter(is_active=True)
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        # 🔥 FIXED: Usitumie id=uuid.uuid4() - model itajaza yenyewe!
        shop = serializer.save(owner=self.request.user)
        
        # 🔥 FIXED: Count products for this shop using seller/owner relationship
        # Tumia seller (ForeignKey) badala ya email
        product_count = Product.objects.filter(seller=self.request.user).count()
        shop.products_count = product_count
        shop.save()

class ShopDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a shop"""
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def search_shops(request):
    """Search shops by query"""
    query = request.query_params.get('q', '')
    
    if not query:
        return Response({
            'success': True,
            'results': []
        })
    
    shops = Shop.objects.filter(
        Q(shop_name__icontains=query) |
        Q(seller_name__icontains=query) |
        Q(main_category__icontains=query) |
        Q(region__icontains=query) |
        Q(district__icontains=query) |
        Q(area__icontains=query),
        is_active=True
    ).distinct()
    
    serializer = ShopSerializer(shops, many=True)
    
    return Response({
        'success': True,
        'query': query,
        'count': shops.count(),
        'results': serializer.data
    })

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_shops_by_region(request, region):
    """Get shops by region"""
    shops = Shop.objects.filter(region__iexact=region, is_active=True)
    serializer = ShopSerializer(shops, many=True)
    
    return Response({
        'success': True,
        'region': region,
        'count': shops.count(),
        'shops': serializer.data
    })