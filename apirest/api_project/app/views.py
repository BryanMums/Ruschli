from django.views.generic import DetailView, ListView, UpdateView, CreateView
from .models import Group, Room, Resident, TaskType, Task, TaskDate, Comment, TaskManager
from .forms import GroupForm, RoomForm, ResidentForm, TaskTypeForm, TaskForm, TaskDateForm, CommentForm
from .serializers import TaskDateSerializer, ResidentSerializer, UserSerializer, TaskTypeSerializer
from django.http import HttpResponse
from datetime import datetime
from rest_framework.decorators import api_view, permission_classes, detail_route
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
def test_comment(request):
    user = request.user
    sector = Group.objects.get(pk=1)
    post = {}
    post["author"] = user.pk
    taskdate = TaskDate.objects.get(pk=56)
    post["taskdate"] = taskdate.pk
    post["text"] = "Ceci est un commentaire de test 2"
    date = "2017-06-19"
    comment = TaskManager.add_comment(post, date)
    taskDateToReturn = comment.taskdate
    serializer = TaskDateSerializer(taskDateToReturn, many=False, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_comment(request):
    comment = TaskManager.add_comment(request.data, request.user)
    if comment is None:
        content = {'Erreur': 'Veuillez fournir les champs de manière correcte'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    else:
        taskdate = comment.taskdate
        serializer = TaskDateSerializer(taskdate, many=False, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_connected_user(request):
    serializer = UserSerializer(request.user, many=False, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def test_create(request):
    post = {}
    post['title'] = "Ceci est un titre"
    post['need_someone'] = False
    post['start_date'] = '2017-05-30'
    post['eventType'] = 0
    post['periodicType'] = 0

    data = TaskManager.create_task(post, request.user)
    if data is None:
        content = {'Erreur': 'Veuillez fournir les champs de manière correcte'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    else:
        serializer = TaskDateSerializer(data, many=False, context={'request': request})
        return Response(serializer.data)


@api_view(['GET'])
def test_update(request):
    pass

@api_view(['GET'])
def get_tasks_for_a_day(request, date_url, group_id, resident_id=None):
    date = datetime.strptime(date_url, '%Y-%m-%d')
    group = Group.objects.get(pk=group_id)
    if resident_id is not None :
        resident = Resident.objects.get(resident_id)
        data = request.user.get_tasks_for_a_day(date, group, resident)
    else:
        data = request.user.get_tasks_for_a_day(date, group, None)
    serializer = TaskDateSerializer(data, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def get_tasks_for_a_day_resident(request, date_url, resident_id):
    date = datetime.strptime(date_url, '%Y-%m-%d')
    resident = Resident.objects.get(pk=resident_id)
    data = request.user.get_tasks_for_a_day(date, None, resident)
    serializer = TaskDateSerializer(data, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def get_residents_active(request):
    data = Resident.objects.filter(active=True)
    serializer = ResidentSerializer(data, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def get_tasktypes_sector(request, sector_id):
    sector = Group.objects.get(pk=sector_id)
    data = TaskType.objects.filter(group=sector)
    serializer = TaskTypeSerializer(data, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_task(request):
    taskdate = TaskManager.create_task(request.data, request.user)
    if taskdate is None:
        content = {'Erreur': 'Veuillez fournir les champs de manière correcte'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    else:
        serializer = TaskDateSerializer(taskdate, many=False, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def update_task(request):
    #TODO : On va recevoir en POST les informations des 2 entités.
    # La première étape va être de savoir s'il faut créer une nouvelle exception/taskdate
    pass


class GroupListView(ListView):
    model = Group


class GroupCreateView(CreateView):
    model = Group
    form_class = GroupForm


class GroupDetailView(DetailView):
    model = Group


class GroupUpdateView(UpdateView):
    model = Group
    form_class = GroupForm


class RoomListView(ListView):
    model = Room


class RoomCreateView(CreateView):
    model = Room
    form_class = RoomForm


class RoomDetailView(DetailView):
    model = Room


class RoomUpdateView(UpdateView):
    model = Room
    form_class = RoomForm


class ResidentListView(ListView):
    model = Resident


class ResidentCreateView(CreateView):
    model = Resident
    form_class = ResidentForm


class ResidentDetailView(DetailView):
    model = Resident


class ResidentUpdateView(UpdateView):
    model = Resident
    form_class = ResidentForm


class TaskTypeListView(ListView):
    model = TaskType


class TaskTypeCreateView(CreateView):
    model = TaskType
    form_class = TaskTypeForm


class TaskTypeDetailView(DetailView):
    model = TaskType


class TaskTypeUpdateView(UpdateView):
    model = TaskType
    form_class = TaskTypeForm


class TaskListView(ListView):
    model = Task


class TaskCreateView(CreateView):
    model = Task
    form_class = TaskForm


class TaskDetailView(DetailView):
    model = Task


class TaskUpdateView(UpdateView):
    model = Task
    form_class = TaskForm


class TaskDateListView(ListView):
    model = TaskDate


class TaskDateCreateView(CreateView):
    model = TaskDate
    form_class = TaskDateForm


class TaskDateDetailView(DetailView):
    model = TaskDate


class TaskDateUpdateView(UpdateView):
    model = TaskDate
    form_class = TaskDateForm


class CommentListView(ListView):
    model = Comment


class CommentCreateView(CreateView):
    model = Comment
    form_class = CommentForm


class CommentDetailView(DetailView):
    model = Comment


class CommentUpdateView(UpdateView):
    model = Comment
    form_class = CommentForm
