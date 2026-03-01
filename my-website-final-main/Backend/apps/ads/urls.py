from django.urls import path
from . import views

urlpatterns = [
    path('', views.AdListCreateView.as_view(), name='ad-list'),
    path('active/', views.get_active_ads, name='active-ads'),
    path('<uuid:pk>/', views.AdDetailView.as_view(), name='ad-detail'),
    path('<uuid:ad_id>/toggle/', views.toggle_ad_status, name='toggle-ad'),
]