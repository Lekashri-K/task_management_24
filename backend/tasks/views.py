from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import CustomUser, Project, Task
from .serializers import UserSerializer, ProjectSerializer, TaskSerializer
from rest_framework.decorators import action

class SuperManagerDashboardStats(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'supermanager':
            return Response({'error': 'Unauthorized'}, status=403)
        
        stats = {
            'total_users': CustomUser.objects.count(),
            'active_projects': Project.objects.count(),
            'pending_tasks': Task.objects.filter(status='pending').count(),
            'completed_tasks': Task.objects.filter(status='completed').count()
        }
        return Response(stats)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if not user:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

class UserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

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

    def create(self, request, *args, **kwargs):
        try:
            # Ensure assigned_to exists and is a manager
            assigned_to_id = request.data.get('assigned_to')
            if not assigned_to_id:
                return Response(
                    {'message': 'Manager assignment is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            assigned_to = CustomUser.objects.filter(
                id=assigned_to_id,
                role='manager'
            ).first()
            
            if not assigned_to:
                return Response(
                    {'message': 'Invalid manager ID provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create the project
            project = Project.objects.create(
                name=request.data.get('name'),
                description=request.data.get('description', ''),
                created_by=request.user,
                assigned_to=assigned_to,
                deadline=request.data.get('deadline')
            )
            
            serializer = self.get_serializer(project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class SuperManagerTaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'supermanager':
            return Task.objects.all()
        return Task.objects.none()

    def perform_create(self, serializer):
        # Automatically set the assigned_by to the current user
        serializer.save(assigned_by=self.request.user)