from django.urls import path, include 
from rest_framework.permissions import AllowAny
from .views import (
    LoginView, 
    UserView,
    SuperManagerDashboardStats,
    SuperManagerUserViewSet,
    SuperManagerProjectViewSet,
    SuperManagerTaskViewSet
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'supermanager/users', SuperManagerUserViewSet, basename='supermanager-users')
router.register(r'supermanager/projects', SuperManagerProjectViewSet, basename='supermanager-projects')
router.register(r'supermanager/tasks', SuperManagerTaskViewSet, basename='supermanager-tasks')

urlpatterns = [
    path('login/', LoginView.as_view(permission_classes=[AllowAny]), name='login'),  # ✅ fixed
    path('user/', UserView.as_view(), name='user'),
    path('supermanager-dashboard-stats/', SuperManagerDashboardStats.as_view(), name='supermanager-dashboard-stats'),
    path('', include(router.urls)),
]
