from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser, Project, Task

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)  # Explicit password field

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'full_name', 'role', 'password']
        
    def create(self, validated_data):
        # Extract password before creating user
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)  # This properly hashes the password
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError("User account is disabled.")
                data['user'] = user
            else:
                raise serializers.ValidationError("Unable to log in with provided credentials.")
        else:
            raise serializers.ValidationError("Must include 'username' and 'password'.")
        
        return data

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'created_by', 'assigned_to', 'created_at', 'deadline']
        read_only_fields = ['created_by', 'created_at']

    def validate(self, data):
        if not data.get('name'):
            raise serializers.ValidationError("Project name is required")
        if len(data.get('name', '')) < 3:
            raise serializers.ValidationError("Project name must be at least 3 characters")
        return data

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ('assigned_by', 'created_at')

    def validate(self, data):
        # Add any custom validation you need
        return data