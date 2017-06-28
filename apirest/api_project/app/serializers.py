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
    default_resident = ResidentSerializer(many=True)
    default_room = RoomSerializer(many=True)
    default_receiver_user = UserSerializer(many=True)
    default_receiver_group = GroupSerializer(many=True)
    default_copyreceiver_user = UserSerializer(many=True)
    default_copyreceiver_group = GroupSerializer(many=True)

    class Meta:
        model = models.TaskType
        fields = (
            'pk',
            'name',
            'default_title',
            'change_title',
            'change_description',
            'default_description',
            'change_time',
            'default_time',
            'change_resident',
            'default_resident',
            'change_room',
            'default_room',
            'change_receiver_user',
            'default_receiver_user',
            'change_receiver_group',
            'default_receiver_group',
            'change_copyreceiver_user',
            'default_copyreceiver_user',
            'change_copyreceiver_group',
            'default_copyreceiver_group',
            'default_need_someone',
            'change_need_someone',
        )


class TaskSerializer(serializers.ModelSerializer):
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
            'author',
            'id_type_task'
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
    task = TaskSerializer(many=False, read_only=False)
    comments = CommentSerializer(many=True, read_only=False)
    taker = UserSerializer(many=False, read_only=True)

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
            'daysOfWeek',
            'taker'
        )
