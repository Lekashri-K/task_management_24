from django.urls import path, include

from rest_framework.permissions import AllowAny
from rest_framework.routers import DefaultRouter
from .views import (
    LoginView, 
    UserView,
    SuperManagerUserViewSet,
    SuperManagerProjectViewSet,
    SuperManagerTaskViewSet
)

router = DefaultRouter()
router.register(r'supermanager/users', SuperManagerUserViewSet, basename='supermanager-users')
router.register(r'supermanager/projects', SuperManagerProjectViewSet, basename='supermanager-projects')
router.register(r'supermanager/tasks', SuperManagerTaskViewSet, basename='supermanager-tasks')

urlpatterns = [
   path('login/', LoginView.as_view(permission_classes=[AllowAny]), name='login'),
    path('user/', UserView.as_view(), name='user'),
    path('', include(router.urls)),
    
]