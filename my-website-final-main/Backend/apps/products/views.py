# backend/apps/products/views.py - ULTIMATE FIXED VERSION 🔥
# ✅ PUBLIC ACCESS - KILA MTU ANAONA BIDHAA ZOTE!
# ✅ INA FUNCTIONS ZOTE: get_products_by_category, search_products, get_seller_products
# ✅ NO USER FILTERING - HAKUNA KUPANGUA KWA MTUMIAJI

from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
import logging
import json
import uuid

from .models import Product
from .serializers import ProductSerializer

logger = logging.getLogger(__name__)

class ProductListCreateView(generics.ListCreateAPIView):
    """
    PUBLIC ACCESS KAMILI - KILA MTU ANAONA BIDHAA ZOTE!
    HAKUNA FILTERING KWA USER - ALL PRODUCTS FOR EVERYONE!
    """
    queryset = Product.objects.all().order_by('-registration_date')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        """
        🔥 IMPORTANT: Return ALL products, not filtered by user!
        """
        try:
            # ✅ RETURN ALL PRODUCTS - NO USER FILTERING!
            print("📦 Returning ALL products from database")
            return Product.objects.all().order_by('-registration_date')
        except Exception as e:
            print(f"⚠️ Error in get_queryset: {e}")
            return Product.objects.none()
    
    def list(self, request, *args, **kwargs):
        """Return ALL products from database"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        print(f"📦 Returning {len(serializer.data)} products from database")
        
        return Response({
            'success': True,
            'count': len(serializer.data),
            'results': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        """
        🔥 HIFADHI DATA KATIKA DATABASE
        """
        print("\n" + "="*70)
        print("🔥 PUBLIC PRODUCT SUBMISSION - SAVING TO DATABASE")
        print("="*70)
        print(f"📥 Data received: {request.data}")
        
        try:
            # Create new product instance
            product = Product()
            product.id = uuid.uuid4()
            
            # Map fields from request data to model fields
            field_mapping = {
                'product_name': 'product_name',
                'shop_name': 'shop_name',
                'seller_name': 'seller_name',
                'business_type': 'business_type',
                'profile_picture': 'profile_picture',
                'main_category': 'main_category',
                'product_category': 'product_category',
                'sub_category': 'sub_category',
                'brand': 'brand',
                'description': 'description',
                'specifications': 'specifications',
                'price': 'price',
                'currency': 'currency',
                'price_type': 'price_type',
                'stock_status': 'stock_status',
                'quantity_available': 'quantity_available',
                'condition': 'condition',
                'warranty': 'warranty',
                'warranty_period': 'warranty_period',
                'size': 'size',
                'color': 'color',
                'material': 'material',
                'country': 'country',
                'region': 'region',
                'district': 'district',
                'area': 'area',
                'street': 'street',
                'map_location': 'map_location',
                'phone_number': 'phone_number',
                'whatsapp_number': 'whatsapp_number',
                'email': 'email',
                'shop_image': 'shop_image',
                'features': 'features',
            }
            
            # Set each field if present
            for request_field, model_field in field_mapping.items():
                if request_field in request.data:
                    setattr(product, model_field, request.data.get(request_field))
            
            # Handle images
            if 'product_images' in request.data:
                images = request.data.get('product_images', [])
                if isinstance(images, str):
                    try:
                        images = json.loads(images)
                    except:
                        images = [images]
                product.product_images = images
                print(f"📸 Saved {len(product.product_images)} images")
            
            # Ensure required fields have defaults
            if not product.product_name:
                product.product_name = 'Product'
            if product.price is None:
                product.price = 0
            if not product.country:
                product.country = 'Tanzania'
            
            # 🔥 HIFADHI KWENYE DATABASE!
            product.save()
            
            print(f"✅✅✅ PRODUCT SAVED! ID: {product.id}")
            print(f"✅✅✅ Product name: {product.product_name}")
            print(f"✅✅✅ Product email: {product.email}")
            
            serializer = self.get_serializer(product)
            return Response({
                'success': True,
                'message': 'Product imehifadhiwa!',
                'product': serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"❌ ERROR saving to database: {e}")
            import traceback
            traceback.print_exc()
            
            return Response({
                'success': False,
                'error': str(e),
                'message': 'Failed to save product'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def perform_create(self, serializer):
        """Save product to database"""
        try:
            serializer.save()
            print(f"✅ Product saved via perform_create")
        except Exception as e:
            print(f"⚠️ Error in perform_create: {e}")
            raise e


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Product details - PUBLIC ACCESS"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]


# ============== 🔥 FUNCTION ZILIZOKUWA ZINAKOSEA SASA ZIPO! ==============

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def search_products(request):
    """Search products - PUBLIC"""
    try:
        query = request.query_params.get('q', '')
        
        if not query:
            products = Product.objects.all().order_by('-registration_date')[:50]
            serializer = ProductSerializer(products, many=True)
            return Response({
                'success': True,
                'count': products.count(),
                'results': serializer.data
            })
        
        products = Product.objects.filter(
            Q(product_name__icontains=query) |
            Q(shop_name__icontains=query) |
            Q(description__icontains=query) |
            Q(email__icontains=query),
            is_active=True
        ).distinct().order_by('-registration_date')
        
        serializer = ProductSerializer(products, many=True)
        return Response({
            'success': True,
            'count': products.count(),
            'results': serializer.data
        })
    except Exception as e:
        print(f"❌ Search error: {e}")
        return Response({'success': True, 'results': []})


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_seller_products(request, seller_email):
    """Get seller products by EMAIL - PUBLIC"""
    try:
        products = Product.objects.filter(
            email__iexact=seller_email,
            is_active=True
        ).order_by('-registration_date')
        
        serializer = ProductSerializer(products, many=True)
        return Response({
            'success': True,
            'count': products.count(),
            'products': serializer.data
        })
    except Exception as e:
        print(f"❌ Seller products error: {e}")
        return Response({'success': True, 'products': []})


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_products_by_category(request, category):
    """Get products by category - PUBLIC"""
    try:
        products = Product.objects.filter(
            Q(main_category__iexact=category) |
            Q(product_category__iexact=category),
            is_active=True
        ).order_by('-registration_date')
        
        serializer = ProductSerializer(products, many=True)
        return Response({
            'success': True,
            'count': products.count(),
            'products': serializer.data
        })
    except Exception as e:
        print(f"❌ Category error: {e}")
        return Response({'success': True, 'products': []})