from . import models
from . import serializers
from rest_framework import viewsets, permissions
from django.contrib.auth.models import User

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for the User class"""

    queryset = User.objects.all();
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class GroupViewSet(viewsets.ModelViewSet):
    """ViewSet for the Group class"""

    queryset = models.Group.objects.all()
    serializer_class = serializers.GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class RoomViewSet(viewsets.ModelViewSet):
    """ViewSet for the Room class"""

    queryset = models.Room.objects.all()
    serializer_class = serializers.RoomSerializer
    permission_classes = [permissions.IsAuthenticated]


class ResidentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Resident class"""

    queryset = models.Resident.objects.all()
    serializer_class = serializers.ResidentSerializer
    permission_classes = [permissions.IsAuthenticated]


class TaskTypeViewSet(viewsets.ModelViewSet):
    """ViewSet for the TaskType class"""

    queryset = models.TaskType.objects.all()
    serializer_class = serializers.TaskTypeSerializer
    permission_classes = [permissions.IsAuthenticated]


class TaskViewSet(viewsets.ModelViewSet):
    """ViewSet for the Task class"""

    queryset = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer
    permission_classes = [permissions.IsAuthenticated]


class TaskDateViewSet(viewsets.ModelViewSet):
    """ViewSet for the TaskDate class"""

    queryset = models.TaskDate.objects.all()
    serializer_class = serializers.TaskDateSerializer
    permission_classes = [permissions.IsAuthenticated]


class CommentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Comment class"""

    queryset = models.Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [permissions.IsAuthenticated]


class RoomViewSet(viewsets.ModelViewSet):
    """ViewSet for the Room class"""

    queryset = models.Room.objects.all()
    serializer_class = serializers.RoomSerializer
    permission_classes = [permissions.IsAuthenticated]


class ResidentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Resident class"""

    queryset = models.Resident.objects.all()
    serializer_class = serializers.ResidentSerializer
    permission_classes = [permissions.IsAuthenticated]


class TaskTypeViewSet(viewsets.ModelViewSet):
    """ViewSet for the TaskType class"""

    queryset = models.TaskType.objects.all()
    serializer_class = serializers.TaskTypeSerializer
    permission_classes = [permissions.IsAuthenticated]


class TaskViewSet(viewsets.ModelViewSet):
    """ViewSet for the Task class"""

    queryset = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer
    permission_classes = [permissions.IsAuthenticated]


class TaskDateViewSet(viewsets.ModelViewSet):
    """ViewSet for the TaskDate class"""

    queryset = models.TaskDate.objects.all()
    serializer_class = serializers.TaskDateSerializer
    permission_classes = [permissions.IsAuthenticated]


class CommentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Comment class"""

    queryset = models.Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
