from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import CustomUser, Project, Task
from .serializers import UserSerializer, ProjectSerializer, TaskSerializer

# Existing views

from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    permission_classes = []  # Allow unauthenticated access
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {'error': 'Account disabled'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            },
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
class UserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# New Super Manager Views
class SuperManagerUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'supermanager':
            return CustomUser.objects.all()
        return CustomUser.objects.none()

class SuperManagerProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'supermanager':
            return Project.objects.filter(created_by=self.request.user)
        return Project.objects.none()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class SuperManagerTaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'supermanager':
            return Task.objects.filter(assigned_by=self.request.user)
        return Task.objects.none()

    def perform_create(self, serializer):
        serializer.save(assigned_by=self.request.user)