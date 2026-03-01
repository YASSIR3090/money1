"""
Main URL Configuration - PUBLIC ACCESS VERSION 🔥
✅ All endpoints are PUBLIC
✅ No authentication required
✅ Products save directly to database
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse, HttpResponse
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# JWT TOKEN ENDPOINTS
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

# ========== ADDITIONAL IMPORTS ==========
from django.core.management import call_command
from django.contrib.auth import get_user_model
from django.db import connection
from datetime import datetime
import os
import re

# ========== HOME PAGE VIEW ==========
def home(request):
    """Homepage ya API - Inaonyesha kwamba API iko live"""
    
    return JsonResponse({
        "success": True,
        "message": "🚀 Availo API iko live! PUBLIC ACCESS - HAKUNA TOKEN INAHITAJIKA!",
        "status": "online",
        "timestamp": str(datetime.now()),
        "endpoints": {
            "admin": {
                "url": "/admin/",
                "description": "Admin panel (inahitaji login)"
            },
            "api_documentation": {
                "swagger": "/api/docs/",
                "redoc": "/api/redoc/",
                "description": "API documentation"
            },
            "authentication": {
                "register": "/api/auth/register/",
                "login": "/api/auth/login/",
                "google": "/api/auth/google/",
                "vendor_check": "/api/auth/vendor/check/"
            },
            "jwt_tokens": {
                "obtain": "/api/token/",
                "refresh": "/api/token/refresh/",
                "verify": "/api/token/verify/"
            },
            "products": {
                "list": "/api/products/",
                "create": "/api/products/ (PUBLIC - hakuna token inahitajika!)",
                "search": "/api/products/search/",
                "by_seller": "/api/products/seller/<email>/",
                "by_category": "/api/products/category/<category>/",
            },
            "shops": {
                "list": "/api/shops/",
                "search": "/api/shops/search/",
                "by_region": "/api/shops/region/<region>/"
            },
            "ads": {
                "active": "/api/ads/active/",
                "list": "/api/ads/"
            },
            "messages": {
                "list": "/api/messages/",
                "detail": "/api/messages/<id>/"
            },
            "setup": {
                "check_db": "/setup/check-db/",
                "create_superuser": "/setup/create-superuser/",
                "collect_static": "/setup/collect-static/"
            }
        },
    })

# ========== VIEW YA KUUANGALIA DATABASE ==========
def check_database(request):
    """Check database connection and user count"""
    
    html = "<h1 style='text-align:center;'>🔍 Database Diagnostic Report</h1><hr>"
    
    # Check 1: Database connection
    html += "<h3>📡 Step 1: Database Connection</h3>"
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        html += "<p style='color:green;'>✅ SUCCESS: Database connected!</p>"
    except Exception as e:
        html += f"<p style='color:red;'>❌ ERROR: {str(e)}</p>"
        html += "<p style='color:orange;'>⚠️ Hii inamaanisha database haijaconnect. Angalia DATABASE_URL environment variable.</p>"
        html += "<hr><a href='/'>Home</a> | <a href='/admin/'>Admin</a>"
        return HttpResponse(html)
    
    # Check 2: User model
    html += "<h3>👤 Step 2: User Model</h3>"
    try:
        User = get_user_model()
        html += "<p style='color:green;'>✅ SUCCESS: User model loaded</p>"
    except Exception as e:
        html += f"<p style='color:red;'>❌ ERROR: {str(e)}</p>"
        return HttpResponse(html)
    
    # Check 3: User count
    html += "<h3>📊 Step 3: User Statistics</h3>"
    try:
        user_count = User.objects.count()
        html += f"<p>✅ Total users: <strong>{user_count}</strong></p>"
    except Exception as e:
        html += f"<p style='color:red;'>❌ ERROR counting users: {str(e)}</p>"
    
    # Check 4: Superuser check
    try:
        super_count = User.objects.filter(is_superuser=True).count()
        html += f"<p>👑 Superusers: <strong>{super_count}</strong></p>"
        
        if super_count == 0:
            html += "<p style='color:orange;'>⚠️ Hakuna superuser! Bonyeza <a href='/setup/create-superuser/' style='font-weight:bold;'>HAPA</a> kuunda.</p>"
    except:
        pass
    
    # Check 5: Tables
    html += "<h3>📋 Step 4: Database Tables</h3>"
    try:
        tables = connection.introspection.table_names()
        html += f"<p>✅ Total tables: <strong>{len(tables)}</strong></p>"
        
        # Check important tables
        important_tables = ['users', 'products', 'shops', 'ads', 'help_messages']
        html += "<ul>"
        for table in important_tables:
            if table in tables:
                html += f"<li style='color:green;'>✅ {table}</li>"
            else:
                html += f"<li style='color:red;'>❌ {table} (Run migrations!)</li>"
        html += "</ul>"
    except Exception as e:
        html += f"<p style='color:red;'>❌ ERROR listing tables: {str(e)}</p>"
    
    # Check 6: Environment variables
    html += "<h3>🔧 Step 5: Environment Variables</h3>"
    db_url = os.environ.get('DATABASE_URL', 'NOT SET')
    if db_url and db_url != 'NOT SET':
        # Mask password for security
        masked = re.sub(r':([^@]+)@', ':****@', db_url)
        html += f"<p>✅ DATABASE_URL: <code>{masked}</code></p>"
    else:
        html += "<p style='color:red;'>❌ DATABASE_URL haijasetiwa!</p>"
    
    debug = os.environ.get('DJANGO_DEBUG', 'NOT SET')
    html += f"<p>🔧 DJANGO_DEBUG: <strong>{debug}</strong></p>"
    
    # Next steps
    html += "<hr><h2 style='text-align:center;'>🚀 Next Steps</h2>"
    html += "<div style='display:flex; justify-content:center; gap:20px;'>"
    html += "<div style='border:1px solid #ccc; padding:15px; border-radius:5px;'>"
    html += "<h3>1️⃣ Create Superuser</h3>"
    html += "<p>Bonyeza <a href='/setup/create-superuser/'>/setup/create-superuser/</a></p>"
    html += "</div>"
    html += "<div style='border:1px solid #ccc; padding:15px; border-radius:5px;'>"
    html += "<h3>2️⃣ Collect Static</h3>"
    html += "<p>Bonyeza <a href='/setup/collect-static/'>/setup/collect-static/</a></p>"
    html += "</div>"
    html += "<div style='border:1px solid #ccc; padding:15px; border-radius:5px;'>"
    html += "<h3>3️⃣ Admin Panel</h3>"
    html += "<p>Bonyeza <a href='/admin/'>/admin/</a></p>"
    html += "</div>"
    html += "</div>"
    
    html += "<hr><p style='text-align:center; color:red;'><strong>⚠️ BAADA YA KUFANIKIWA, ONDOA SETUP URLS!</strong></p>"
    
    return HttpResponse(html)

# ========== VIEW YA KUUNDA SUPERUSER ==========
def create_superuser(request):
    """Tengeneza superuser kwa ajili ya admin"""
    try:
        User = get_user_model()
        if not User.objects.filter(is_superuser=True).exists():
            # Use environment variable for password in production
            admin_password = os.environ.get('ADMIN_PASSWORD', 'Admin123!')
            User.objects.create_superuser(
                username='admin',
                email='admin@availo.co.tz',
                password=admin_password
            )
            return HttpResponse(f"""
                <h1 style='color:green; text-align:center;'>✅ Superuser imeundwa!</h1>
                <div style='text-align:center;'>
                    <p><strong>Email:</strong> admin@availo.co.tz</p>
                    <p><strong>Password:</strong> {admin_password}</p>
                    <p><a href='/admin/' style='font-size:18px;'>➡️ Ingia kwenye Admin</a></p>
                    <p style='color:orange;'><small>Kumbuka kubadilisha password baada ya kuingia!</small></p>
                </div>
            """)
        return HttpResponse("""
            <h1 style='color:blue; text-align:center;'>ℹ️ Superuser tayari ipo</h1>
            <div style='text-align:center;'>
                <p><a href='/admin/'>Nenda kwenye Admin</a></p>
            </div>
        """)
    except Exception as e:
        return HttpResponse(f"<h1 style='color:red;'>❌ Hitilafu: {str(e)}</h1>")

# ========== VIEW YA KUKUSANYA STATIC FILES ==========
def collect_static(request):
    """Kusanya static files"""
    try:
        call_command('collectstatic', '--noinput')
        return HttpResponse("""
            <h1 style='color:green; text-align:center;'>✅ Static files zimekusanywa!</h1>
            <div style='text-align:center;'>
                <p>Sasa admin itafanya kazi vizuri.</p>
                <p><a href='/admin/'>➡️ Jaribu Admin sasa</a></p>
            </div>
        """)
    except Exception as e:
        return HttpResponse(f"<h1 style='color:red;'>❌ Hitilafu: {str(e)}</h1>")

# ========== SWAGGER CONFIG ==========
schema_view = get_schema_view(
    openapi.Info(
        title="Availo API",
        default_version='v1',
        description="API for Availo Marketplace - PUBLIC ACCESS! Hakuna token inahitajika!",
        contact=openapi.Contact(email="support@availo.co.tz"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

# ========== MAIN URL PATTERNS ==========
urlpatterns = [
    # Homepage (Root URL)
    path('', home, name='home'),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # JWT TOKEN ENDPOINTS
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Auth endpoints
    path('api/auth/', include('apps.accounts.urls')),
    
    # PRODUCTS - PUBLIC ACCESS KAMILI!
    path('api/products/', include('apps.products.urls')),
    
    # Other endpoints
    path('api/shops/', include('apps.shops.urls')),
    path('api/ads/', include('apps.ads.urls')),
    path('api/messages/', include('apps.help_messages.urls')),
    
    # SETUP URLS (ONDOA BAADA YA KUTUMIA)
    path('setup/check-db/', check_database, name='check-db'),
    path('setup/create-superuser/', create_superuser, name='create-superuser'),
    path('setup/collect-static/', collect_static, name='collect-static'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)