from django.http import JsonResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from .models import User, UserDocument, JobApplication, UserMessage
from .serializers import (
    UserSerializer, UserRegistrationSerializer, LoginSerializer,
    JobApplicationSubmitSerializer, UserMessageSerializer
)

@api_view(['GET'])
def home(request):
    return JsonResponse({
        'message': 'Welcome to Zawamis API',
        'endpoints': {
            'register': '/api/register/',
            'login': '/api/login/',
            'profile': '/api/profile/{id}/',
            'apply_job': '/api/apply-job/',
            'messages': '/api/messages/',
            'admin_panel': '/admin/'
        }
    })

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def register_user(request):
    try:
        # Check if email already exists
        if User.objects.filter(email=request.data.get('email')).exists():
            return Response({'success': False, 'message': 'Email already registered. Please login instead.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Check if ID number already exists
        if User.objects.filter(id_number=request.data.get('idNumber')).exists():
            return Response({'success': False, 'message': 'ID Number already registered.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create a copy of the request data
        data = request.data.copy()
        
        # Map frontend field names to backend field names
        field_mapping = {
            'firstName': 'first_name',
            'middleName': 'middle_name', 
            'lastName': 'last_name',
            'dateOfBirth': 'date_of_birth',
            'phoneNumber': 'phone_number',
            'idNumber': 'id_number',
            'maritalStatus': 'marital_status',
            'formFourNumber': 'form_four_number',
            'confirmPassword': 'confirm_password',
            'passportPhoto': 'passport_photo',
            'birthCertificate': 'birth_certificate',
            'educationCertificate': 'education_certificate'
        }
        
        # Convert all field names from camelCase to snake_case
        for frontend_field, backend_field in field_mapping.items():
            if frontend_field in data:
                data[backend_field] = data.pop(frontend_field)
        
        serializer = UserRegistrationSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            user_serializer = UserSerializer(user)
            return Response({'success': True, 'message': 'Registration successful', 'user': user_serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({'success': False, 'message': 'Validation failed', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            
    except IntegrityError:
        return Response({'success': False, 'message': 'Database error: User might already exist'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'success': False, 'message': f'Registration failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def login_user(request):
    try:
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'message': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = User.objects.get(email=email, is_active=True)
        except User.DoesNotExist:
            return Response({'success': False, 'message': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if user.check_password(password):
            user_serializer = UserSerializer(user)
            return Response({'success': True, 'message': 'Login successful', 'user': user_serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'success': False, 'message': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        return Response({'success': False, 'message': f'Login failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_user_profile(request, user_id):
    try:
        user = User.objects.get(id=user_id, is_active=True)
        serializer = UserSerializer(user)
        return Response({'success': True, 'user': serializer.data}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'success': False, 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'success': False, 'message': f'Error retrieving user: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def submit_job_application(request):
    try:
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'success': False, 'message': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(id=user_id, is_active=True)
        except User.DoesNotExist:
            return Response({'success': False, 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = JobApplicationSubmitSerializer(data=request.data)
        if serializer.is_valid():
            job_application = JobApplication(
                user=user,
                job_title=serializer.validated_data['job_title'],
                cv=serializer.validated_data['cv'],
                cover_letter=serializer.validated_data['cover_letter']
            )
            job_application.save()
            
            return Response({'success': True, 'message': 'Application submitted successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'success': False, 'message': 'Invalid data', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({'success': False, 'message': f'Application failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def submit_user_message(request):
    try:
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'success': False, 'message': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(id=user_id, is_active=True)
        except User.DoesNotExist:
            return Response({'success': False, 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserMessageSerializer(data=request.data)
        if serializer.is_valid():
            user_message = UserMessage(
                user=user,
                message=serializer.validated_data['message'],
                file=serializer.validated_data.get('file'),
                file_name=request.FILES.get('file').name if request.FILES.get('file') else None,
                file_type=request.FILES.get('file').content_type if request.FILES.get('file') else None
            )
            user_message.save()
            
            return Response({'success': True, 'message': 'Message sent successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'success': False, 'message': 'Invalid data', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({'success': False, 'message': f'Message sending failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_user_messages(request, user_id):
    try:
        user = User.objects.get(id=user_id, is_active=True)
        messages = UserMessage.objects.filter(user=user).order_by('-created_at')
        serializer = UserMessageSerializer(messages, many=True)
        return Response({'success': True, 'messages': serializer.data}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'success': False, 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'success': False, 'message': f'Error retrieving messages: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)