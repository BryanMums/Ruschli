from . import models
from django.contrib.auth.models import User

from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'comments'
        )


class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Group
        fields = (
            'pk',
            'title',
            'description',
        )


class RoomSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Room
        fields = (
            'pk',
            'title',
            'number',
            'floor',
        )


class ResidentSerializer(serializers.ModelSerializer):

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
        )


class TaskTypeSerializer(serializers.ModelSerializer):

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


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Task
        fields = (
            'pk',
            'title',
            'description',
            'created_at',
            'updated_at',
            'need_someone',
        )


class TaskDateSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.TaskDate
        fields = (
            'pk',
            'eventType',
            'start_date',
            'end_date',
            'time',
            'active',
            'created_at',
            'updated_at',
        )


class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Comment
        fields = (
            'pk',
            'created_at',
            'updated_at',
            'text',
        )