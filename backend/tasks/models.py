from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)

# Custom User Model
class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('supermanager', 'Super Manager'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
    ]

    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def _str_(self):
        return self.username

    class Meta:
        db_table = 'custom_user'

# Project Model
class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_by = models.ForeignKey(
        CustomUser,
        related_name='created_projects',
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'supermanager'}
    )
    assigned = models.ForeignKey(
        CustomUser,
        related_name='assigned_projects',
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'manager'}
    )
    created_at = models.DateTimeField(default=timezone.now)

    def _str_(self):
        return self.name

    class Meta:
        db_table = 'project'

# Task Model
class Task(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('inprogress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    assigned_by = models.ForeignKey(CustomUser, related_name='tasks_given', on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(
        CustomUser,
        related_name='tasks_received',
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'employee'}
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=timezone.now)

    def _str_(self):
        return self.title

    class Meta:
        db_table = 'task'