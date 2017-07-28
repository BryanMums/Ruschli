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

@api_view(['POST'])
def add_task(request):
    '''
    Vue permettant de créer une nouvelle tâche dans le temps (Tâche et apparition).
    '''
    taskdate = TaskManager.create_task(request.data, request.user)
    if taskdate is None:
        content = {'Erreur': 'Veuillez fournir les champs de manière correcte'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    else:
        serializer = TaskDateSerializer(taskdate, many=False, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def update_task(request):
    '''
    Vue permettant de modifier une tâche dans le temps (Tâche et apparition).
    '''
    taskDate = TaskManager.update_task(request.data, request.user)
    if taskDate is None:
        content = {'Erreur': 'problème lors de la modification'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    else:
        serializer = TaskDateSerializer(taskDate, many=False, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def stop_task(request):
    '''
    Vue permettant d'arrêter une tâche dans le temps (Tâche et apparition).
    '''
    success = TaskManager.stop_task(request.data, request.user)
    if not success:
        content = {'Erreur': 'problème lors de l\'arrêt de la tâche'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    else:
        content = {'Succès': 'La tâche a bien été arrêtée'}
        return Response(content, status=status.HTTP_200_OK)


@api_view(['POST'])
def add_taker(request):
    '''
    Vue permettant d'ajouter l'utilisateur comme personne s'occupant d'une tâche
    '''
    taskDate = TaskManager.add_taker(request.data, request.user)
    if taskDate is None:
        content = {'Erreur': 'Veuillez fournir les champs de manière correcte'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    else:
        serializer = TaskDateSerializer(taskDate, many=False, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def add_comment(request):
    '''
    Vue permettant de créer et ajouter un commentaire à une tâche (TaskDate)
    '''
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
    '''
    Vue permettant simplement de récupérer les informations de l'utilisateur.
    '''
    serializer = UserSerializer(request.user, many=False, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_tasks_for_a_day(request, date_url, group_id):
    '''
    Vue permettant de récupérer les tâches concernant un utilisateur et son secteur
    dans lequel il travaille en fonction de la date.
    '''
    try:
        date = datetime.strptime(date_url, '%Y-%m-%d')
        if(group_id == 0 or group_id == '0'):
            group = None
        else:
            group = Group.objects.get(pk=group_id)

        data = TaskManager.get_tasks_for_a_day(request.user, date, group, None)
        serializer = TaskDateSerializer(data, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        content = {'Erreur': 'Le secteur ou la date ne sont pas corrects !'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_tasks_for_a_day_resident(request, date_url, resident_id):
    '''
    Vue permettant de récupérer les tâches liées à un résident en fonction de la date.
    '''
    try:
        date = datetime.strptime(date_url, '%Y-%m-%d')
        resident = Resident.objects.get(pk=resident_id)
        data = TaskManager.get_tasks_for_a_day(request.user, date, None, resident)
        serializer = TaskDateSerializer(data, many=True, context={'request': request})
        return Response(serializer.data)
    except Exception as e:
        content = {'Erreur': 'Le résident ou la date ne sont pas corrects !'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_residents_active(request):
    '''
    Vue permettant de récupérer la liste des résidents actifs.
    '''
    data = Resident.objects.filter(active=True)
    serializer = ResidentSerializer(data, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_tasktypes_sector(request, sector_id):
    '''
    Vue permettant de récupérer les types qu'un secteur a le droit de créer.
    '''
    try:
        sector = Group.objects.get(pk=sector_id)
        data = TaskType.objects.filter(group=sector)
        serializer = TaskTypeSerializer(data, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        content = {'Erreur': 'Le secteur donné n\'existe pas !'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_taskDate_date(request, pk, date_url):
    '''
    Vue permettant de récupérer la bonne TaskDate (Apparition) selon un ID et une date.
    '''
    try:
        date = datetime.strptime(date_url, '%Y-%m-%d')
        data = TaskManager().get_taskDate_date(pk, date)
        if data:
            serializer = TaskDateSerializer(data, many=False, context={'request': request})
            return Response(serializer.data)
        else:
            raise

    except Exception as e:
        print(e)
        content = {'Erreur': 'l\'ID et la date ne correspondent pas !'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_permissions(request, pk, group_id):
    '''
    Vue permettant de récupérer les permissions concernant une apparition et sa tâche
    par rapport à un utilisateur et son secteur.
    '''
    try:
        taskDate = TaskDate.objects.get(pk=pk)
        if group_id == '0':
            group = None
            print("mdr")
        else:
            group = Group.objects.get(pk=group_id)
        data = {}
        data["can_take"] = taskDate.can_take(request.user, group)
        data["can_update"] = taskDate.can_modify(request.user)
        data["can_comment"] = taskDate.can_comment(request.user, group)
        return Response(data, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        content = {'Erreur': 'Problème au niveau de la tâche ou du secteur !'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def activate_taskdate(request, pk, date_url):
    '''
    Vue permettant de réactiver un jour d'une tâche périodique
    '''
    try:
        date = datetime.strptime(date_url, '%Y-%m-%d')
        if TaskManager.activate_taskdate(request.user, pk, date):
            content = {'Succès': 'La tâche a bien été réactivée pour le '+date_url}
            return Response(content, status=status.HTTP_200_OK)
        else:
            raise

    except Exception as e:
        print(e)
        content = {'Erreur': 'la tâche à cette date ne peux pas être activée !'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
