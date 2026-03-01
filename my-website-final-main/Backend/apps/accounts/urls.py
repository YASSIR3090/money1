from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('google/', views.google_auth, name='google_auth'),  # 🔥 SASA INAFANANA!
    path('login/', views.login_user, name='login'),
    path('me/', views.get_current_user, name='current-user'),
    path('vendor/register/', views.register_vendor, name='vendor-register'),
    path('vendor/check/', views.check_vendor_status, name='vendor-check'),
]