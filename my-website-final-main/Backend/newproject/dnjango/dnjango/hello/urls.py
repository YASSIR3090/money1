from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register_user, name='register_user'),
    path('login/', views.login_user, name='login_user'),
    path('profile/<int:user_id>/', views.get_user_profile, name='get_user_profile'),
    path('apply-job/', views.submit_job_application, name='submit_job_application'),
    path('messages/', views.submit_user_message, name='submit_user_message'),
    path('messages/<int:user_id>/', views.get_user_messages, name='get_user_messages'),
]