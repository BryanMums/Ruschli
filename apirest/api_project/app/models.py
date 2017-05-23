from django.core.urlresolvers import reverse
from django_extensions.db.fields import AutoSlugField
from django.db.models import *
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from django.contrib.auth import models as auth_models
from django.db import models as models
from django_extensions.db import fields as extension_fields
from django.contrib.auth.models import User

class Group(models.Model):

    # Fields
    title = CharField(max_length=30)
    description = TextField(null=True)

    # Relationship Fields
    users = ManyToManyField(User)

    class Meta:
        ordering = ('-pk',)

    def __unicode__(self):
        return u'%s' % self.pk

    def get_absolute_url(self):
        return reverse('app_group_detail', args=(self.pk,))


    def get_update_url(self):
        return reverse('app_group_update', args=(self.pk,))


class Room(models.Model):

    # Fields
    title = CharField(max_length=30)
    number = IntegerField(null=True)
    floor = IntegerField(null=True)


    class Meta:
        ordering = ('-pk',)

    def __unicode__(self):
        return u'%s' % self.pk

    def get_absolute_url(self):
        return reverse('app_room_detail', args=(self.pk,))


    def get_update_url(self):
        return reverse('app_room_update', args=(self.pk,))


class Resident(models.Model):

    # Fields
    firstname = CharField(max_length=40)
    lastname = CharField(max_length=40)
    birthdate = DateField()
    comment = TextField(null=True, blank=True)
    allergies = TextField(null=True, blank=True)
    medications = TextField(null=True, blank=True)
    contact_name = CharField(max_length=80, blank=True)
    contact_phone = CharField(max_length=15, blank=True)
    active = BooleanField(default=True)

    # Relationship Fields
    room = ForeignKey(Room, null=True, blank=True)

    class Meta:
        ordering = ('-pk',)

    def __unicode__(self):
        return u'%s' % self.pk

    def get_absolute_url(self):
        return reverse('app_resident_detail', args=(self.pk,))


    def get_update_url(self):
        return reverse('app_resident_update', args=(self.pk,))


class TaskType(models.Model):

    # Fields
    name = CharField(max_length=50)
    default_title = CharField(max_length=60, null=True)
    change_title = BooleanField(default=True)
    change_description = BooleanField(default=True)
    change_resident = BooleanField(default=True)
    change_room = BooleanField(default=True)
    change_receiver_user = BooleanField(default=True)
    change_receiver_group = BooleanField(default=True)
    change_copyreceiver_user = BooleanField(default=True)
    change_copyreceiver_group = BooleanField(default=True)
    default_need_someone = BooleanField(default=False)
    change_need_someone = BooleanField(default=True)

    # Relationship Fields
    group = ManyToManyField(Group)
    default_resident = ManyToManyField(Resident, blank=True)
    default_room = ManyToManyField(Room, blank=True)
    default_receiver_user = ManyToManyField(User, blank=True, related_name="tasktype_receiver_users")
    default_receiver_group = ManyToManyField(Group, blank=True, related_name="tasktype_receiver_groups")
    default_copyreceiver_user = ManyToManyField(User, blank=True, related_name="tasktype_copyreceiver_users")
    default_copyreceiver_group = ManyToManyField(Group, blank=True, related_name="tasktype_copyreceiver_groups")

    class Meta:
        ordering = ('-pk',)

    def __unicode__(self):
        return u'%s' % self.pk

    def get_absolute_url(self):
        return reverse('app_tasktype_detail', args=(self.pk,))


    def get_update_url(self):
        return reverse('app_tasktype_update', args=(self.pk,))


class Task(models.Model):

    # Fields
    title = CharField(max_length=60)
    description = TextField(null=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    need_someone = BooleanField(default=False)

    # Relationship Fields
    id_type_task = ForeignKey(TaskType, null=True, blank=True)
    resident = ManyToManyField(Resident, blank=True)
    room = ManyToManyField(Room, blank=True)
    receiver_user = ManyToManyField(User, blank=True, related_name="task_receiver_users")
    receiver_group = ManyToManyField(Group, blank=True, related_name="task_receiver_groups")
    copyreceiver_user = ManyToManyField(User, blank=True, related_name="task_copyreceiver_users")
    copyreceiver_group = ManyToManyField(Group, blank=True, related_name="task_copyreceiver_groups")
    author = ForeignKey(User, related_name="task_authors")

    class Meta:
        ordering = ('-pk',)

    def __unicode__(self):
        return u'%s' % self.pk

    def get_absolute_url(self):
        return reverse('app_task_detail', args=(self.pk,))


    def get_update_url(self):
        return reverse('app_task_update', args=(self.pk,))


class TaskDate(models.Model):

    # Fields
    eventType = IntegerField(default=0)
    start_date = DateField()
    end_date = DateField(null=True, blank=True)
    time = TimeField(null=True, blank=True)
    active = BooleanField(default=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    # Relationship Fields
    parent = ForeignKey('self', null=True, blank=True)
    task = ForeignKey(Task)

    class Meta:
        ordering = ('-pk',)

    def __unicode__(self):
        return u'%s' % self.pk

    def get_absolute_url(self):
        return reverse('app_taskdate_detail', args=(self.pk,))


    def get_update_url(self):
        return reverse('app_taskdate_update', args=(self.pk,))


class Comment(models.Model):

    # Fields
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    text = TextField()

    # Relationship Fields
    author = ForeignKey(User, related_name='comments')
    taskdate = ForeignKey(TaskDate)

    class Meta:
        ordering = ('-pk',)

    def __unicode__(self):
        return u'%s' % self.pk

    def get_absolute_url(self):
        return reverse('app_comment_detail', args=(self.pk,))


    def get_update_url(self):
        return reverse('app_comment_update', args=(self.pk,))
