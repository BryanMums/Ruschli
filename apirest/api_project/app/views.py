from django.views.generic import DetailView, ListView, UpdateView, CreateView
from .models import Group, Room, Resident, TaskType, Task, TaskDate, Comment
from .forms import GroupForm, RoomForm, ResidentForm, TaskTypeForm, TaskForm, TaskDateForm, CommentForm


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
