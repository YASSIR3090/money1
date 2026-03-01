# backend/apps/accounts/views.py
# ✅ ULTIMATE FIXED VERSION - WITH PROPER PASSWORD HASHING
# ✅ Email na product images zinahifadhiwa kwenye database

from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import requests
import logging
import uuid

from .serializers import UserSerializer, VendorRegistrationSerializer

User = get_user_model()
logger = logging.getLogger(__name__)

def get_tokens_for_user(user):
    """Inatengeneza JWT tokens (access & refresh)"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# ============== GOOGLE AUTH ==============
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_auth(request):
    """Inapokea Google token na kuunda user"""
    
    token = request.data.get('access_token')
    
    if not token:
        return Response({
            'success': False,
            'error': 'Token ya Google inahitajika'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Uliza Google kuhusu huyu mtumiaji
        user_info_res = requests.get(
            f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={token}",
            timeout=10
        )
        
        if user_info_res.status_code != 200:
            return Response({
                'success': False,
                'error': 'Token ya Google imekwisha muda wake'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        google_data = user_info_res.json()
        email = google_data.get('email')
        google_id = google_data.get('sub')
        name = google_data.get('name', email.split('@')[0] if email else 'User')
        picture = google_data.get('picture')
        
        if not email or not google_id:
            return Response({
                'success': False,
                'error': 'Google haikutoa taarifa kamili'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Tafuta au unda mtumiaji
        user = User.objects.filter(email=email).first()
        
        if not user:
            # Create new user with google_id as username
            username = google_id[:150]
            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=google_data.get('given_name', ''),
                last_name=google_data.get('family_name', ''),
                google_id=google_id,
                provider='google',
                provider_id='google',
                picture=picture,
                photo=picture,
                email_verified=True,
                has_real_google_picture=bool(picture)
            )
            logger.info(f"✅ Mtumiaji mpya ametengenezwa kwa Google: {email}")
        else:
            # Update existing user
            user.google_id = google_id
            user.provider = 'google'
            user.provider_id = 'google'
            if picture and not user.picture:
                user.picture = picture
                user.photo = picture
                user.has_real_google_picture = True
            user.save()
            logger.info(f"✅ Mtumiaji amerudi (Google): {email}")

        # Tengeneza Token
        tokens = get_tokens_for_user(user)
        
        # Serialize user data
        user_data = UserSerializer(user).data
        
        return Response({
            'success': True,
            'message': 'Login imefanikiwa',
            'user': user_data,
            'access': tokens['access'],
            'refresh': tokens['refresh'],
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"🔥 Google auth error: {str(e)}")
        return Response({
            'success': False,
            'error': f'Server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============== REGISTER USER (EMAIL/PASSWORD) ==============
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """Register a new user with email and password"""
    
    email = request.data.get('email')
    password = request.data.get('password')
    name = request.data.get('name', email.split('@')[0] if email else 'User')
    
    if not email:
        return Response({
            'success': False,
            'error': 'Email inahitajika'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not password:
        return Response({
            'success': False,
            'error': 'Password inahitajika'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user already exists
    if User.objects.filter(email=email).exists():
        return Response({
            'success': False,
            'error': 'User with this email already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Create username from email
        base_username = email.split('@')[0][:140]
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username[:135]}{counter}"
            counter += 1
        
        # ✅ HASH password inafanywa na create_user!
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            name=name,
            display_name=name,
            provider='email',
            provider_id='email'
        )
        
        tokens = get_tokens_for_user(user)
        
        return Response({
            'success': True,
            'user': UserSerializer(user).data,
            'access': tokens['access'],
            'refresh': tokens['refresh'],
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"❌ Registration error: {e}")
        return Response({
            'success': False,
            'error': f'Registration failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============== LOGIN USER ==============
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    """Login with email and password"""
    
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({
            'success': False,
            'error': 'Email and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Django authenticate inatumia email kwa sababu USERNAME_FIELD = 'email'
    user = authenticate(request, username=email, password=password)
    
    if user:
        tokens = get_tokens_for_user(user)
        return Response({
            'success': True,
            'user': UserSerializer(user).data,
            'access': tokens['access'],
            'refresh': tokens['refresh'],
        }, status=status.HTTP_200_OK)
    
    return Response({
        'success': False,
        'error': 'Invalid email or password'
    }, status=status.HTTP_401_UNAUTHORIZED)


# ============== GET CURRENT USER ==============
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_current_user(request):
    """Get current authenticated user"""
    serializer = UserSerializer(request.user)
    return Response({
        'success': True,
        'user': serializer.data
    })


# ============== VENDOR REGISTRATION ==============
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def register_vendor(request):
    """Register as a vendor"""
    from apps.accounts.models import VendorRegistration
    
    data = request.data.copy()
    data['user'] = request.user.id
    
    serializer = VendorRegistrationSerializer(data=data)
    
    if serializer.is_valid():
        vendor = serializer.save()
        
        # Update user to be vendor
        request.user.is_vendor = True
        request.user.shop_name = vendor.shop_name
        request.user.business_type = vendor.business_type
        request.user.whatsapp_number = vendor.whatsapp_number
        request.user.country = vendor.country
        request.user.region = vendor.region
        request.user.district = vendor.district
        request.user.area = vendor.area
        request.user.street = vendor.street
        request.user.map_location = vendor.map_location
        request.user.opening_hours = vendor.opening_hours
        request.user.save()
        
        return Response({
            'success': True,
            'message': 'Vendor registration successful',
            'vendor': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


# ============== CHECK VENDOR STATUS ==============
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def check_vendor_status(request):
    """Check if current user is a vendor"""
    return Response({
        'success': True,
        'is_vendor': request.user.is_vendor,
        'shop_name': request.user.shop_name,
        'business_type': request.user.business_type
    })


# ============== CHECK VENDOR STATUS BY EMAIL ==============
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def check_vendor_status_by_email(request):
    """Check vendor status by email (public endpoint)"""
    email = request.query_params.get('email')
    
    if not email:
        return Response({
            'success': False,
            'error': 'Email parameter is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        return Response({
            'success': True,
            'is_registered': user.is_vendor,
            'shop_name': user.shop_name,
            'business_type': user.business_type
        })
    except User.DoesNotExist:
        return Response({
            'success': True,
            'is_registered': False,
            'message': 'User not found'
        })