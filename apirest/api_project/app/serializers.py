from . import models
from django.contrib.auth.models import User

from rest_framework import serializers




class GroupSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = models.Group
        fields = (
            'pk',
            'title',
            'description',
        )

class UserSerializer(serializers.HyperlinkedModelSerializer):
    sectors = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = User

        fields = (
            'id',
            'username',
            'comments',
            'sectors'
        )

class RoomSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = models.Room
        fields = (
            'pk',
            'title',
            'number',
            'floor',
        )


class ResidentSerializer(serializers.HyperlinkedModelSerializer):
    room = RoomSerializer(many=False)

    class Meta:
        model = models.Resident
        fields = (
            'pk',
            'firstname',
            'lastname',
            'birthdate',
            'comment',
            'allergies',
            'medications',
            'contact_name',
            'contact_phone',
            'active',
            'room'
        )


class TaskTypeSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = models.TaskType
        fields = (
            'pk',
            'name',
            'default_title',
            'change_title',
            'change_description',
            'change_resident',
            'change_room',
            'change_receiver_user',
            'change_receiver_group',
            'change_copyreceiver_user',
            'change_copyreceiver_group',
            'default_need_someone',
            'change_need_someone',
        )


class TaskSerializer(serializers.HyperlinkedModelSerializer):
    room = RoomSerializer(many=True)
    resident = ResidentSerializer(many=True)
    receiver_user = UserSerializer(many=True)
    receiver_group = GroupSerializer(many=True)
    copyreceiver_user = UserSerializer(many=True)
    copyreceiver_group = GroupSerializer(many=True)
    author = UserSerializer(many=False)

    class Meta:
        model = models.Task
        fields = (
            'pk',
            'title',
            'description',
            'created_at',
            'updated_at',
            'need_someone',
            'room',
            'resident',
            'receiver_user',
            'receiver_group',
            'copyreceiver_user',
            'copyreceiver_group',
            'author'
        )

class CommentSerializer(serializers.HyperlinkedModelSerializer):
    author = UserSerializer(many=False)

    class Meta:
        model = models.Comment
        fields = (
            'pk',
            'created_at',
            'updated_at',
            'text',
            'author'
        )

class TaskDateSerializer(serializers.ModelSerializer):
    task = TaskSerializer(many=False)
    comments = CommentSerializer(many=True)

    class Meta:
        model = models.TaskDate
        fields = (
            'pk',
            'parent',
            'task',
            'eventType',
            'periodicType',
            'start_date',
            'end_date',
            'time',
            'active',
            'created_at',
            'updated_at',
            'comments',
            'monthlyType',
            'intervalWeek',
            'dayNumber',
            'intervalMonth',
            'weekNumber',
            'daysOfWeek'
        )
