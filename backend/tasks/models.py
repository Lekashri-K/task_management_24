from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

# First define the CustomUserManager
class CustomUserManager(BaseUserManager):

    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(
            username=username,
            email=email,
            **extra_fields
        )
        user.set_password(password)  # This must come before save()
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'supermanager')
        return self.create_user(username, email, password, **extra_fields)

# Then define the CustomUser model
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

    def __str__(self):
        return f"{self.full_name} ({self.role})"

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

# Now define Project which references CustomUser
class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_by = models.ForeignKey(
        CustomUser,
        related_name='created_projects',
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'supermanager'}
    )
    assigned_to = models.ForeignKey(
        CustomUser,
        related_name='assigned_projects',
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'manager'}
    )
    created_at = models.DateTimeField(default=timezone.now)
    deadline = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} (Managed by: {self.assigned_to.full_name})"

    class Meta:
        ordering = ['-created_at']

# Then define Task which references both Project and CustomUser
class Task(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField()
    project = models.ForeignKey(Project, related_name='tasks', on_delete=models.CASCADE)
    assigned_by = models.ForeignKey(
        CustomUser, 
        related_name='tasks_assigned',
        on_delete=models.CASCADE,
        limit_choices_to={'role__in': ['supermanager', 'manager']}
    )
    assigned_to = models.ForeignKey(
        CustomUser,
        related_name='tasks',
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'employee'}
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=timezone.now)
    due_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"

    class Meta:
        ordering = ['-created_at']