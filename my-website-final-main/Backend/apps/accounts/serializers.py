# backend/apps/accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, VendorRegistration
import uuid

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'display_name', 'picture', 'photo',
            'provider', 'provider_id', 'email_verified', 'login_time',
            'is_vendor', 'shop_name', 'business_type', 'whatsapp_number',
            'country', 'region', 'district', 'area', 'street',
            'map_location', 'opening_hours'
        ]
        read_only_fields = ['id', 'login_time']

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField(required=False, allow_blank=True)
    display_name = serializers.CharField(required=False, allow_blank=True)
    picture = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    provider = serializers.CharField(default='email')
    provider_id = serializers.CharField(default='email')
    password = serializers.CharField(write_only=True, required=False)  # ✅ Password inahitajika kwa email users

class GoogleAuthSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField(required=False, allow_blank=True)
    given_name = serializers.CharField(required=False, allow_blank=True)
    family_name = serializers.CharField(required=False, allow_blank=True)
    picture = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    sub = serializers.CharField()  # Google ID
    email_verified = serializers.BooleanField(default=False)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class VendorRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorRegistration
        fields = '__all__'
        read_only_fields = ['id', 'registration_date', 'last_updated']

    def create(self, validated_data):
        validated_data['id'] = uuid.uuid4()
        return super().create(validated_data)