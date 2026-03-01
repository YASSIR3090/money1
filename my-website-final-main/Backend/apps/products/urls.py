from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProductListCreateView.as_view(), name='product-list'),
    path('<uuid:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('search/', views.search_products, name='product-search'),
    path('seller/<str:seller_email>/', views.get_seller_products, name='seller-products'),
    path('category/<str:category>/', views.get_products_by_category, name='category-products'),
]