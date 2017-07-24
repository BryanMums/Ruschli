from django import forms
from .models import Group, Room, Resident, TaskType, Task, TaskDate, Comment

class GroupForm(forms.ModelForm):
    '''
    Formulaire pour l'ajout/modification d'un secteur
    '''
    class Meta:
        model = Group
        fields = ['title', 'description', 'users']


class RoomForm(forms.ModelForm):
    '''
    Formulaire pour l'ajout/modification d'une salle
    '''
    class Meta:
        model = Room
        fields = ['title', 'number', 'floor']


class ResidentForm(forms.ModelForm):
    '''
    Formulaire pour l'ajout/modification d'un résident
    '''
    class Meta:
        model = Resident
        fields = ['firstname', 'lastname', 'birthdate', 'comment', 'allergies', 'medications', 'contact_name', 'contact_phone', 'active', 'room']


class TaskTypeForm(forms.ModelForm):
    '''
    Formulaire pour l'ajout/modification d'un type de tâche
    '''
    class Meta:
        model = TaskType
        fields = ['name', 'default_title', 'change_title', 'change_description', 'change_resident', 'change_room', 'change_receiver_user', 'change_receiver_group', 'change_copyreceiver_user', 'change_copyreceiver_group', 'default_need_someone', 'change_need_someone', 'group', 'default_resident', 'default_room', 'default_receiver_user', 'default_receiver_group', 'default_copyreceiver_user', 'default_copyreceiver_group']


class TaskForm(forms.ModelForm):
    '''
    Formulaire pour l'ajout/modification d'une tâche
    '''
    class Meta:
        model = Task
        fields = ['title', 'description', 'need_someone', 'id_type_task', 'resident', 'room', 'receiver_user', 'receiver_group', 'copyreceiver_user', 'copyreceiver_group', 'author']


class TaskDateForm(forms.ModelForm):
    '''
    Formulaire pour l'ajout/modification d'une apparition de tâche
    '''
    class Meta:
        model = TaskDate
        fields = ['eventType', 'start_date', 'end_date', 'time', 'active', 'parent', 'task', 'daysOfWeek']


class CommentForm(forms.ModelForm):
    '''
    Formulaire pour l'ajout/modification d'un commentaire
    '''
    class Meta:
        model = Comment
        fields = ['text', 'author', 'taskdate']
