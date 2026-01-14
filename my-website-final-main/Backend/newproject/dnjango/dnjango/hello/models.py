from django.db import models
import hashlib
from django.utils import timezone


class User(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    MARITAL_STATUS_CHOICES = [
        ('single', 'Single'),
        ('married', 'Married'),
        ('divorced', 'Divorced'),
        ('widowed', 'Widowed'),
    ]

    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    id_number = models.CharField(max_length=20, unique=True)
    marital_status = models.CharField(max_length=10, choices=MARITAL_STATUS_CHOICES)
    form_four_number = models.CharField(max_length=50)
    password = models.CharField(max_length=255)
    registration_date = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def set_password(self, raw_password):
        """Hash password before saving"""
        self.password = hashlib.sha256(raw_password.encode()).hexdigest()

    def check_password(self, raw_password):
        return self.password == hashlib.sha256(raw_password.encode()).hexdigest()


class UserDocument(models.Model):
    DOCUMENT_TYPES = [
        ('passport_photo', 'Passport Photo'),
        ('birth_certificate', 'Birth Certificate'),
        ('education_certificate', 'Education Certificate'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=30, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='user_documents/%Y/%m/%d/')
    uploaded_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'user_documents'

    def __str__(self):
        return f"{self.user.email} - {self.document_type}"


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('rejected', 'Rejected'),
        ('hired', 'Hired'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    job_title = models.CharField(max_length=200)
    cv = models.FileField(upload_to='applications/cv/')
    cover_letter = models.FileField(upload_to='applications/cover_letters/')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    application_date = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'job_applications'

    def __str__(self):
        return f"{self.user.email} - {self.job_title}"


class UserMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    message = models.TextField()
    file = models.FileField(upload_to='user_messages/', blank=True, null=True)
    file_name = models.CharField(max_length=255, blank=True, null=True)
    file_type = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    admin_reply = models.TextField(blank=True, null=True)
    reply_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'user_messages'

    def __str__(self):
        return f"{self.user.email} - {self.created_at}"
