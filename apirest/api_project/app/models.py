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
from django.dispatch import receiver
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token
from datetime import datetime
from django.db.models import Q
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MaxValueValidator, MinValueValidator
import datetime as datetime2

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

class Day(models.Model):

    # Fields
    name = CharField(max_length=15)

    def __str__(self):
        return self.name

class Group(models.Model):

    # Fields
    title = CharField(max_length=30)
    description = TextField(null=True)

    # Relationship Fields
    users = ManyToManyField(User, related_name='sectors')

    class Meta:
        ordering = ('-pk',)

    def __unicode__(self):
        return u'%s' % self.pk

    def get_absolute_url(self):
        return reverse('app_group_detail', args=(self.pk,))

    def get_update_url(self):
        return reverse('app_group_update', args=(self.pk,))

    def __str__(self):
        return self.title


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
    EVENT_TYPES = (
        (0, 'Non périodique'),
        (1, 'Périodique'),
    )
    PERIODIC_TYPES = (
        (0, 'Quotidien'),
        (1, 'Hebdomadaire'),
        (2, 'Mensuel'),
        (3, 'Annuel'),
    )
    MONTHLY_TYPES = (
        (0, 'Date du jour répété'),
        (1, 'Quel jour de quelle semaine dans le mois')
    )
    DAYS_OF_WEEK = (
        (0, 'Lundi'),
        (1, 'Mardi'),
        (2, 'Mercredi'),
        (3, 'Jeudi'),
        (4, 'Vendredi'),
        (5, 'Samedi'),
        (6, 'Dimanche'),
    )
    WEEK_NUMBER = (
        (0, 'Premier'),
        (1, 'Deuxième'),
        (2, 'Troisième'),
        (3, 'Quatrième'),
        (4, 'Cinquième'),
    )
    # Fields
    eventType = IntegerField(default=0, choices=EVENT_TYPES)
    periodicType = IntegerField(default=0, choices=PERIODIC_TYPES, blank=True, null=True)
    monthlyType = IntegerField(default=0, choices=MONTHLY_TYPES, blank=True, null=True)
    start_date = DateField()
    end_date = DateField(null=True, blank=True)
    time = TimeField(null=True, blank=True)
    intervalWeek = IntegerField(null=True, blank=True)
    dayNumber = IntegerField(null=True, blank=True, validators=[MaxValueValidator(31),MinValueValidator(1)])
    intervalMonth = IntegerField(null=True, blank=True)
    weekNumber = IntegerField(choices=WEEK_NUMBER, blank=True, null=True)
    active = BooleanField(default=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)


    # Relationship Fields
    parent = ForeignKey('self', null=True, blank=True)
    task = ForeignKey(Task)
    daysOfWeek = ManyToManyField(Day, null=True, blank=True)
    #taker = ForeignKey(User)

    class Meta:
        ordering = ('-pk',)

    def __unicode__(self):
        return u'%s' % self.pk

    def get_absolute_url(self):
        return reverse('app_taskdate_detail', args=(self.pk,))

    def get_update_url(self):
        return reverse('app_taskdate_update', args=(self.pk,))

    def __str__(self):
        return self.task.title + " : " + str(self.id)


class Comment(models.Model):

    # Fields
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    text = TextField()

    # Relationship Fields
    author = ForeignKey(User, related_name='comments')
    taskdate = ForeignKey(TaskDate, related_name='comments')

    class Meta:
        ordering = ('-pk',)

    def __unicode__(self):
        return u'%s' % self.pk

    def get_absolute_url(self):
        return reverse('app_comment_detail', args=(self.pk,))


    def get_update_url(self):
        return reverse('app_comment_update', args=(self.pk,))


def get_groups(self):
    return self.sectors.all()

User.add_to_class('get_groups', get_groups)

def get_tasks_for_a_day(self, date = datetime.now(), group=1):
    # Récupérer toutes les TaskDate où la date se situe après le début et avant la fin
    groupObj = Group.objects.get(pk=group)
    TaskDates =  TaskDate.objects.filter(
        Q(start_date__lte = date)
        &
        (Q(end_date__gte = date) | Q(end_date__isnull = True))
        &
        (
        Q(task__receiver_user = self.id) | Q(task__copyreceiver_user = self.id) |
        Q(task__receiver_group = groupObj.id) | Q(task__copyreceiver_group = groupObj.id)
        ))

    # On va calculer pour ne garder que celle qui tombent le jour J
    accurateTaskDates = []
    for taskdate in TaskDates:
        # Les informations que l'on aura besoin de base
        eventType = taskdate.eventType
        start_date = taskdate.start_date
        end_date = taskdate.end_date

        # Variable permettant de savoir si on devra garder la TaskDate
        isToAdd = False

        # On va d'abord gérer le cas des tâches non périodique
        if eventType == 0 :
            # Dans ce cas-là, on doit juste regarder si la date est la même
            if start_date == date.date() :
                isToAdd = True

        # Puis gérer les cas des tâches périodiques
        elif eventType == 1 :
            periodicType = taskdate.periodicType
            # Quotidien
            if periodicType == 0 :
                # Pas besoin de tester + car on est déjà sûr d'être dans la plage de date.
                isToAdd = True

            # Hebdomadaire
            elif periodicType == 1 :
                if date.weekday() in taskdate.daysOfWeek :
                # Se répète chaque semaine
                    if taskdate.intervalWeek == 1 | taskdate.intervalWeek is None:
                        # on doit juste regarder si on est le bon jour de la semaine
                        isToAdd = True
                    # Se répète chaque x semaines
                    else :
                        dt = datetime.strptime(date.date(), '%Y-%m-%d')
                        newdate = dt - timedelta(days=dt.weekday())
                        while newdate <= date.date():
                            enddate = newdate = datetime.timedelta(days=6)
                            if date.date() >= newdate & date.date() <= endate :
                                isToAdd = True
                                break
                            newdate += datetime.timedelta(days=7 * taskdate.intervalWeek)

            # Mensuel
            elif periodicType == 2 :
                # Premier cas, date du jour répété
                if taskdate.monthlyType == 0 :
                    if date.date().day == taskdate.dayNumber:
                        if taskdate.intervalMonth == 1 :
                            isToAdd = True
                        else:
                            new_date = start_date
                            while new_date <= date.date():
                                if new_date.month == date.month and new_date.year == date.year:
                                    isToAdd = True
                                    break
                                month = new_date.month - 1 + taskdate.intervalMonth
                                year = int(new_date.year + month / 12 )
                                month = month % 12 + 1
                                new_date = datetime2.date(year,month,new_date.day)

                # Deuxième cas, exemple : le deuxième mardi tous les 2 mois
                elif taskdate.monthlyType == 1 :
                    for day in taskdate.daysOfWeek.all() :
                        if date.weekday() == day.id :
                            if taskdate.weekNumber * 7 < date.day < (taskdate.weekNumber + 1) * 7 :
                                new_date = start_date
                                while new_date <= date.date():
                                    if new_date.month == date.month and new_date.year == date.year:
                                        isToAdd = True
                                        break
                                    month = new_date.month - 1 + taskdate.intervalMonth
                                    year = int(new_date.year + month / 12 )
                                    month = month % 12 + 1
                                    new_date = datetime2.date(year,month,new_date.day)

            # Annuel
            elif periodicType == 3 :
                if date.day == start_date.day and date.month == start_date.month:
                    isToAdd = True

        if isToAdd :
            accurateTaskDates.append(taskdate)

    # La dernière étape va être de ne pas garder les exceptions et leur parent.
    # Exemple : On a une tâche qui est faite tous les lundis, mais un lundi spécifique, on a modifié cette tâche
    # Il faut donc ne garder que l'exception
    # TODO : A optimiser !

    # On va récupérer les ID à enlever de la liste
    ids_to_remove = []
    for taskdate in accurateTaskDates :
        if taskdate.parent is not None :
            ids_to_remove.append(taskdate.parent)

    # On va les enlever de la liste
    for index in ids_to_remove:
        accurateTaskDates.remove(index)

    return accurateTaskDates

User.add_to_class('get_tasks_for_a_day', get_tasks_for_a_day)
