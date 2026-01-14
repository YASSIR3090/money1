from rest_framework import serializers
from .models import User, UserDocument, JobApplication, UserMessage


class UserDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDocument
        fields = ['document_type', 'file', 'uploaded_at']
        read_only_fields = ['uploaded_at']


class UserMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMessage
        fields = [
            'id', 'message', 'file', 'file_name', 'file_type',
            'created_at', 'admin_reply', 'reply_date'
        ]
        read_only_fields = ['created_at', 'reply_date']


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ['id', 'job_title', 'cv', 'cover_letter', 'status', 'application_date']
        read_only_fields = ['application_date']


class UserSerializer(serializers.ModelSerializer):
    documents = UserDocumentSerializer(many=True, read_only=True)
    messages = UserMessageSerializer(many=True, read_only=True)
    applications = JobApplicationSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'middle_name', 'last_name', 'date_of_birth',
            'phone_number', 'email', 'gender', 'id_number', 'marital_status',
            'form_four_number', 'registration_date', 'is_active',
            'documents', 'messages', 'applications'
        ]
        read_only_fields = ['registration_date', 'is_active']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)
    passport_photo = serializers.FileField(write_only=True)
    birth_certificate = serializers.FileField(write_only=True)
    education_certificate = serializers.FileField(write_only=True)

    class Meta:
        model = User
        fields = [
            'first_name', 'middle_name', 'last_name', 'date_of_birth',
            'phone_number', 'email', 'gender', 'id_number', 'marital_status',
            'form_four_number', 'password', 'confirm_password',
            'passport_photo', 'birth_certificate', 'education_certificate'
        ]

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        passport_photo = validated_data.pop('passport_photo')
        birth_certificate = validated_data.pop('birth_certificate')
        education_certificate = validated_data.pop('education_certificate')

        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        # Save documents
        UserDocument.objects.create(user=user, document_type='passport_photo', file=passport_photo)
        UserDocument.objects.create(user=user, document_type='birth_certificate', file=birth_certificate)
        UserDocument.objects.create(user=user, document_type='education_certificate', file=education_certificate)

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class JobApplicationSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ['job_title', 'cv', 'cover_letter']


class SimpleUserMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMessage
        fields = ['message', 'file']
