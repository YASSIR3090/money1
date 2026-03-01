from rest_framework import serializers
from .models import HelpMessage

class HelpMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HelpMessage
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class ReplySerializer(serializers.Serializer):
    text = serializers.CharField()
    admin_email = serializers.EmailField()