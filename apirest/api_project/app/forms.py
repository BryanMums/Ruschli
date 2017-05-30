from django import forms
from .models import Group, Room, Resident, TaskType, Task, TaskDate, Comment


class GroupForm(forms.ModelForm):
    class Meta:
        model = Group
        fields = ['title', 'description', 'users']


class RoomForm(forms.ModelForm):
    class Meta:
        model = Room
        fields = ['title', 'number', 'floor']


class ResidentForm(forms.ModelForm):
    class Meta:
        model = Resident
        fields = ['firstname', 'lastname', 'birthdate', 'comment', 'allergies', 'medications', 'contact_name', 'contact_phone', 'active', 'room']


class TaskTypeForm(forms.ModelForm):
    class Meta:
        model = TaskType
        fields = ['name', 'default_title', 'change_title', 'change_description', 'change_resident', 'change_room', 'change_receiver_user', 'change_receiver_group', 'change_copyreceiver_user', 'change_copyreceiver_group', 'default_need_someone', 'change_need_someone', 'group', 'default_resident', 'default_room', 'default_receiver_user', 'default_receiver_group', 'default_copyreceiver_user', 'default_copyreceiver_group']


class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'need_someone', 'id_type_task', 'resident', 'room', 'receiver_user', 'receiver_group', 'copyreceiver_user', 'copyreceiver_group', 'author']


class TaskDateForm(forms.ModelForm):
    DAYS_OF_WEEK = (
        (0, 'Lundi'),
        (1, 'Mardi'),
        (2, 'Mercredi'),
        (3, 'Jeudi'),
        (4, 'Vendredi'),
        (5, 'Samedi'),
        (6, 'Dimanche'),
    )
    #daysOfWeek = forms.MultipleChoiceField(choices=DAYS_OF_WEEK, widget=forms.SelectMultiple)
    class Meta:
        model = TaskDate
        fields = ['eventType', 'start_date', 'end_date', 'time', 'active', 'parent', 'task', 'daysOfWeek']


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['text', 'author', 'taskdate']
