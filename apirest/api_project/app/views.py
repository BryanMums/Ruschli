from django.views.generic import DetailView, ListView, UpdateView, CreateView
from .models import Group, Room, Resident, TaskType, Task, TaskDate, Comment
from .forms import GroupForm, RoomForm, ResidentForm, TaskTypeForm, TaskForm, TaskDateForm, CommentForm
from .serializers import TaskDateSerializer, ResidentSerializer
from django.http import HttpResponse
from datetime import datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response

def test(request):
    data = request.user.get_tasks_for_a_day(datetime.now(), 1, None)
    return HttpResponse(data)

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
def get_residents_active(request):
    data = Resident.objects.filter(active=True)
    serializer = ResidentSerializer(data, many=True, context={'request': request})
    return Response(serializer.data)

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
