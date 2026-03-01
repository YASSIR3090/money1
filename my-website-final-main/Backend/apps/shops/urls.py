from django.urls import path
from . import views

urlpatterns = [
    path('', views.ShopListCreateView.as_view(), name='shop-list'),
    path('<uuid:pk>/', views.ShopDetailView.as_view(), name='shop-detail'),
    path('search/', views.search_shops, name='shop-search'),
    path('region/<str:region>/', views.get_shops_by_region, name='shops-by-region'),
]