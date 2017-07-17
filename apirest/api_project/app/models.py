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
from django.db import transaction
from django.db import IntegrityError

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

    def __str__(self):
        return self.title

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

    def __str__(self):
        return self.firstname + " " + self.lastname

    def __unicode__(self):
        return u'%s' % self.pk

    def get_absolute_url(self):
        return reverse('app_resident_detail', args=(self.pk,))


    def get_update_url(self):
        return reverse('app_resident_update', args=(self.pk,))


class TaskType(models.Model):

    # Fields
    name = CharField(max_length=50)
    default_title = CharField(max_length=60, null=True, blank=True)
    change_title = BooleanField(default=True)
    default_description = TextField(null=True, blank=True)
    change_description = BooleanField(default=True)
    default_time = TimeField(null=True, blank=True)
    change_time = BooleanField(default=True)
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

    def __str__(self):
        return self.name

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
    resident = ManyToManyField(Resident, blank=True, null=True)
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
    taker = ForeignKey(User, related_name='task_takers', null=True, blank=True)

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

    def is_an_exception(self):
        # A modifier en OR avec eventType == 0 or parent != None ?
        if self.eventType == 0:
            return True
        else:
            if self.parent == None:
                return False
            return True

    def can_comment(self, user, sector):
        # S'il la tâche est destinée à l'utilisateur ou s'il est l'auteur
        return user is self.task.author or user in (self.task.receiver_user.all() or self.task.copyreceiver_user.all()) \
         or sector in (self.task.receiver_group.all() or self.task.copyreceiver_group.all())

    def can_take(self, user, sector):
        return user in self.task.receiver_user.all() or sector in self.task.receiver_group.all()

    def can_modify(self, user):
        pass


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


class TaskManager(models.Manager):
    @staticmethod
    def create_an_exception(taskDate, date):
        ancient = TaskDate.objects.get(pk=taskDate.pk)
        exception = taskDate
        exception.pk = None
        exception.start_date = date
        exception.eventType = 0
        exception.save()
        exception.parent = ancient
        exception.save()
        return exception

    @staticmethod
    def update_relational_fields_task(task, values):
        task.resident.set(values["resident"])
        task.room.set(values["room"])
        task.receiver_user.set(values["receiver_user"])
        task.receiver_group.set(values["receiver_group"])
        task.copyreceiver_user.set(values["copyreceiver_user"])
        task.copyreceiver_group.set(values["copyreceiver_group"])


    @staticmethod
    def copy_task_if_necessary(task):
        if TaskDate.objects.filter(task=task).count() > 1 :
            print("On crée !")
            ancient = Task.objects.get(pk=task.pk)
            modifiedTask = task
            modifiedTask.pk = None
            modifiedTask.save()
            modifiedTask.resident.set(ancient.resident.all())
            modifiedTask.room.set(ancient.room.all())
            modifiedTask.receiver_user.set(ancient.receiver_user.all())
            modifiedTask.receiver_group.set(ancient.receiver_group.all())
            modifiedTask.copyreceiver_user.set(ancient.copyreceiver_user.all())
            modifiedTask.copyreceiver_group.set(ancient.copyreceiver_group.all())
            return modifiedTask
        return task

    def update_task(post, user):
        # TODO : Vérifier si l'utilisateur a les droits.
        output = ""
        taskDate = TaskDate.objects.get(pk=post["taskdate"])
        values = post["values"] # Les valeurs du formulaire pour la modification des informations basiques et de la périodicité.
        onlyAtTheDate = post["onlyAtDate"] # True --> Uniquement le jour J, False --> A partir du jour J
        date = post["date"] # La date à laquelle on veut modifier

        # Les valeurs passées dans le POST que l'on va trier pour les 2 différentes entités et les filtrer.
        keys_of_task = ['title', 'description', 'need_someone', 'id_type_task']
        keys_of_task_relational_fields = ['resident', 'room', 'receiver_user', 'receiver_group', 'copyreceiver_user', 'copyreceiver_group']
        keys_of_taskDate = ['eventType', 'periodicType', 'monthlyType', 'start_date', 'end_date', 'time', 'intervalWeek', 'dayNumber', 'intervalMonth', 'weekNumber', 'active', 'daysOfWeek', 'taker']

        # Création des dictionnaires qui vont servir pour l'ajout/modification
        dict_values_task = { k: values[k] for k in keys_of_task if k in values if k in values }
        dict_values_task["author"] = user.pk
        dict_values_task_relational_fields = { k: values[k] for k in keys_of_task_relational_fields if k in values if k in values }
        dict_values_taskDate = { k: values[k] for k in keys_of_taskDate if k in values }
        dict_values_taskDate_exception = { k: dict_values_taskDate[k] for k in ['time', 'active', 'taker'] if k in dict_values_taskDate }

        # TODO : Les tests depuis une tâche non périodique ont été fait !
        # Dans le cas d'une tâche non-périodique et qui n'est pas une exception.
        if taskDate.eventType == 0 and taskDate.parent == None:
            print("non-p et aucun parent")

            # Si avec la modification on reste dans une tâche non-périodique
            if values["eventType"] == 0:
                # On fait une copie de la tâche (et non taskDate) pour éviter de modifier les anciennes s'il y a besoin
                taskDate.task = TaskManager().copy_task_if_necessary(taskDate.task)
                taskDate.save()

                # On modifie la tâche
                Task.objects.filter(pk=taskDate.task.pk).update(**dict_values_task)
                # TODO : Les champs relationnels
                task = Task.objects.get(pk=taskDate.task.pk)
                TaskManager().update_relational_fields_task(task, dict_values_task_relational_fields)

                # On modifie la taskDate
                TaskDate.objects.filter(pk=taskDate.pk).update(**dict_values_taskDate)

                return taskDate

            # Si avec la modification on passe d'une tâche non-périodique à une tâche périodique
            else:
                # On va devoir regarder si la tâche a des commentaires ou un quelqu'un qui s'en occupe.
                # Si elle en a


                if Comment.objects.filter(taskdate=taskDate.pk).count() > 0 or taskDate.taker != None:
                    # Dans ce cas, il faudra créer une copie de la tâche. Passer celle de base en exception de la nouvelle qui sera périodique.
                    # On fait une copie de la tâche (et non taskDate) pour éviter de modifier les anciennes s'il y a besoin
                    taskDate.task = TaskManager().copy_task_if_necessary(taskDate.task)
                    taskDate.save()

                    # On va faire les modifications au niveau de la tâche
                    Task.objects.filter(pk=taskDate.task.pk).update(**dict_values_task)
                    # TODO : Les champs relationnels
                    task = Task.objects.get(pk=taskDate.task.pk)
                    TaskManager().update_relational_fields_task(task, dict_values_task_relational_fields)

                    # On fait les modifications concernant la périodicité
                    TaskDate.objects.filter(pk=taskDate.pk).update(**dict_values_taskDate)
                    exception_pk = taskDate.pk
                    taskDate = TaskDate.objects.get(pk=taskDate.pk)

                    # On fait la copie de la taskdate
                    copiedTaskDate = taskDate
                    copiedTaskDate.pk = None
                    copiedTaskDate.taker = None
                    copiedTaskDate.save()

                    # On remet les infos de base pour une exception
                    exception = TaskDate.objects.get(pk=exception_pk)
                    exception.start_date = date
                    exception.eventType = 0
                    exception.end_date = None

                    # On met à l'exception, le nouveau parent.
                    exception.parent = copiedTaskDate
                    exception.save()

                    return exception

                else:
                    # Dans ce cas, il n'y pas besoin d'avoir une exception. On peut simplement modifier
                    # On fait une copie de la tâche (et non taskDate) pour éviter de modifier les anciennes s'il y a besoin
                    taskDate.task = TaskManager().copy_task_if_necessary(taskDate.task)
                    taskDate.save()

                    # On applique les modifications
                    TaskDate.objects.filter(pk=taskDate.pk).update(**dict_values_taskDate)
                    Task.objects.filter(pk=taskDate.task.pk).update(**dict_values_task)

                    # TODO : Les champs relationnels
                    task = Task.objects.get(pk=taskDate.task.pk)
                    TaskManager().update_relational_fields_task(task, dict_values_task_relational_fields)

                    taskDate = TaskDate.objects.get(pk=taskDate.pk)


                return taskDate

        # Dans le cas d'une tâche qui est une exception.
        elif taskDate.eventType == 0 and taskDate.parent != None:
            # Si la modification ne s'applique que pour le jour J.
            if onlyAtTheDate:
                # On fait une copie de la tâche (et non taskDate) pour éviter de modifier les anciennes s'il y a besoin
                taskDate.task = TaskManager().copy_task_if_necessary(taskDate.task)
                taskDate.save()

                # On va faire les modifications voulues
                TaskDate.objects.filter(pk=taskDate.pk).update(**dict_values_taskDate)
                Task.objects.filter(pk=taskDate.task.pk).update(**dict_values_task)
                # TODO : Les champs relationnels
                task = Task.objects.get(pk=taskDate.task.pk)
                TaskManager().update_relational_fields_task(task, dict_values_task_relational_fields)

                taskDate = TaskDate.objects.get(pk=taskDate.pk)

                return taskDate


            # Si la modification s'applique à partir de cette date.
            else:
                # On va commencer par supprimer les exceptions de la tâche parent après le jour J.
                parentTaskDate = taskDate.parent
                TaskDate.objects.filter(Q(parent=parentTaskDate) & Q(start_date__gt=date)).delete()

                # On va ensuite arrêter la tâche parent au jour J-1.
                truedate = datetime.strptime(date, '%Y-%m-%d')
                end_date = (truedate - datetime2.timedelta(days=1)).date()
                parentTaskDate.end_date = end_date
                parentTaskDate.save()

                # On va appliquer les modifications de base.
                taskDate.task = TaskManager().copy_task_if_necessary(taskDate.task)
                taskDate.save()
                Task.objects.filter(pk=taskDate.task.pk).update(**dict_values_task)
                # TODO : Les champs relationnels
                task = Task.objects.get(pk=taskDate.task.pk)
                TaskManager().update_relational_fields_task(task, dict_values_task_relational_fields)

                taskDate = TaskDate.objects.get(pk=taskDate.pk)

                # Si elle doit rester une exception car elle a des commentaires ou quelqu'un s'en occupe
                if Comment.objects.filter(taskdate=taskDate.pk).count() > 0 or taskDate.taker != None:

                    saved_pk = taskDate.pk
                    # On va ensuite faire une copie de la tâche.
                    copiedTaskDate = taskDate
                    copiedTaskDate.pk = None
                    copiedTaskDate.parent = None
                    copiedTaskDate.save()

                    # Modifier la tâche exception et Transformer la tâche copiée en tâche périodique.
                    TaskDate.objects.filter(pk=saved_pk).update(**dict_values_taskDate_exception)
                    TaskDate.objects.filter(pk=copiedTaskDate.pk).update(**dict_values_taskDate)

                    taskDate = TaskDate.objects.get(pk=saved_pk)
                    copiedTaskDate = TaskDate.objects.get(pk=copiedTaskDate.pk)
                    # Définir la tâche copiée comme parent de la tâche de base.
                    taskDate.parent = copiedTaskDate
                    taskDate.save()

                    return taskDate

                # Si elle ne doit pas forcément être une exception car elle sera identique en tout point à la nouvelle tâche (si c'était une tâche modifiée)
                else:
                    # On va la modifier directement et la passer en tant que tâche principale.
                    TaskDate.objects.filter(pk=taskDate.pk).update(**dict_values_taskDate)
                    taskDate = TaskDate.objects.get(pk=taskDate.pk)
                    taskDate.parent = None
                    taskDate.save()

                    return taskDate


        # Dans le cas d'une tâche périodique.
        # TODO : Les tests ont été faits et c'est ok.
        elif taskDate.eventType == 1:
            print("Périodique")
            # Si on veut uniquement modifier le jour J
            if onlyAtTheDate:
                print("OnlyAtTheDate")

                # Créer une exception.
                exception = TaskManager().create_an_exception(taskDate, date)
                # modifier l'exception.
                TaskDate.objects.filter(pk=exception.pk).update(**dict_values_taskDate_exception)
                exception = TaskDate.objects.get(pk=exception.pk)
                exception.task = TaskManager().copy_task_if_necessary(exception.task)
                exception.save()
                Task.objects.filter(pk=exception.task.pk).update(**dict_values_task)
                # TODO : Les champs relationnels
                task = Task.objects.get(pk=exception.task.pk)
                TaskManager().update_relational_fields_task(task, dict_values_task_relational_fields)

                exception = TaskDate.objects.get(pk=exception.pk)
                return exception

            # Si on veut modifier tous les jours à partir de la date.
            else:
                print("Toutes les dates")

                saved_pk = taskDate.pk
                # On fait une copie de la tâche.
                copiedTaskDate = taskDate
                copiedTaskDate.pk = None
                copiedTaskDate.save()

                # On arrête la tâche de base avec end_date = Jour J-1
                truedate = datetime.strptime(date, '%Y-%m-%d')
                end_date = (truedate - datetime2.timedelta(days=1)).date()
                taskDate =  TaskDate.objects.get(pk=saved_pk)
                taskDate.end_date = end_date
                taskDate.save()

                #TODO: A améliorer -> Si c'est le premier jour de la tâche, on peut directement la modifier.

                # On supprime les tâches exceptions qui sont après le jour J par rapport à la tâche de base.
                TaskDate.objects.filter(Q(parent=taskDate) & Q(start_date__gt=date)).delete()

                # On modifie la tâche de la taskdate
                copiedTaskDate.task = TaskManager().copy_task_if_necessary(copiedTaskDate.task)
                copiedTaskDate.save()
                Task.objects.filter(pk=copiedTaskDate.task.pk).update(**dict_values_task)
                # TODO : Les champs relationnels
                task = Task.objects.get(pk=copiedTaskDate.task.pk)
                TaskManager().update_relational_fields_task(task, dict_values_task_relational_fields)


                # On modifie la taskdate
                TaskDate.objects.filter(pk=copiedTaskDate.pk).update(**dict_values_taskDate)
                copiedTaskDate = TaskDate.objects.get(pk=copiedTaskDate.pk)
                return copiedTaskDate

        # Dans un cas impossible.
        else:
            pass

        return None

    def stop_task(post, user):
        output = "" #Debug
        taskDate = TaskDate.objects.get(pk=post["taskdate"])
        # La première chose à faire sera de vérifier si l'utilisateur a les droits pour faire ça.
        # TODO
        date = post["date"]
        typeStop = post["type"] # 0 --> uniquement à la date. 1 --> la date et les suivantes.
        includeDate = post["includeDate"] # True -- > end_date = date - 1 jour, False --> end_date = date
        parentTaskDate = None

        # On va récupérer le parent de la tâche.
        if taskDate.parent != None:
            parentTaskDate = taskDate.parent

        # On va calculer la end_date pour un arrêt de type périodique
        # Si on veut que le jour J soit pris, end_date = date - 1 jour
        if includeDate:
            truedate = datetime.strptime(date, '%Y-%m-%d')
            end_date = (truedate - datetime2.timedelta(days=1)).date()
            output += str(end_date)
        # Si on veut arrêter après la date, end_date = date
        else:
            end_date = date
            output += end_date

        # Si la tâche de base est non périodique
        if taskDate.eventType == 0:
            output += "La tâche est non-périodique \n"
            # Si c'est une tâche non périodique
            if parentTaskDate is None:
                output += "Ce n'est pas une exception, elle ne dépend de rien, on la supprime \n"
                # On va simplement la supprimer (Désactiver pour le moment)
                taskDate.active = False
                taskDate.save()
            # Si c'est une exception
            else:
                output += "C'est une exception d'une tâche périodique ! \n"
                # Si on veut juste arrêter au jour J, donc l'exception uniquement
                if typeStop == 0:
                    output += "On va juste désactiver l'exception \n"
                    # On va mettre le champ active à false
                    taskDate.active = False
                    taskDate.save()
                # Si on veut arrêter la tâche périodique
                elif typeStop == 1:
                    output += "On veut arrêter la tâche périodique \n"
                    # On va changer le end_date du parent avec le end_date calculé au-dessus.
                    parentTaskDate.end_date = end_date
                    parentTaskDate.save()
                    # On va également supprimer les exceptions APRES le end_date. Les tâches qui ont en parent, le tâche parente.
                    exceptions = TaskDate.objects.filter(Q(parent=parentTaskDate.pk) & Q(start_date__gt=end_date)).delete()


        # Si c'est une tâche périodique
        elif taskDate.eventType == 1:
            output += "La tâche est périodique \n"
            # Si on veut arrêter au jour J, donc l'exception uniquement.
            if typeStop == 0:
                output += "On veut juste enlever désactiver la tâche à la date, on crée une exception avec active = false \n"
                # On va commencer par regarder s'il existe une exception à la date voulue, si c'est pas le cas. On crée une exception.
                exception = TaskDate.objects.filter(Q(parent=taskDate) & Q(start_date=end_date)).first()
                if exception == None:
                    exception = TaskManager().create_an_exception(taskDate, end_date)
                # On va mettre le champ active de l'exception à false.
                exception.active = False
                exception.save()

            # Si on veut arrêter la tâche périodique
            elif typeStop == 1:
                output += "On va arrêter la tâche périodique \n"
                # On va changer le end_date avec le end_date calculé au-dessus.
                taskDate.end_date = end_date
                # On va également supprimer les exceptions APRES le end_date. Les tâches qui ont en parent, le tâche.
                exceptions = TaskDate.objects.filter(Q(parent=taskDate) & Q(start_date__gt=end_date)).delete()

        return True, output #A changer par un vrai return


    def add_taker(post, user):
        # On va d'abord voir s'il y a besoin d'un taker ou s'il en existe un.
        taskDate = TaskDate.objects.get(pk=post["taskdate"])
        sector = Group.objects.get(pk=post["sector"])
        if not taskDate.is_an_exception():
            possibleTaskDate = TaskDate.objects.filter(parent = taskDate, start_date = post['date']).first()
            if possibleTaskDate == None :
                taskDate = TaskManager().create_an_exception(taskDate, post["date"])
            else:
                taskDate = possibleTaskDate
        if taskDate.can_take(user, sector):
            if taskDate.task.need_someone == False or taskDate.taker != None:
                return None
            taskDate.taker = user
            taskDate.save()
            return taskDate
        return None


    def add_comment(post, user):
        taskDate = TaskDate.objects.get(pk=post['taskdate'])
        if not taskDate.is_an_exception():
            # Il faut encore faire le test s'il y a une exception qui existe déjà.
            # Le cas où la personne est sur la tâche qui n'est pas encore une exception mais qu'une exception a été créée.
            possibleTaskDate = TaskDate.objects.filter(parent = taskDate, start_date = post['date']).first()
            if possibleTaskDate == None :
                post["taskdate"] = TaskManager().create_an_exception(taskDate, post['date']).pk
            else:
                post["taskdate"] = possibleTaskDate.pk

        comment = Comment.objects.create(text = post['text'],
                                        author = User.objects.get(pk=user.pk),
                                        taskdate = TaskDate.objects.get(pk=post['taskdate']))
        return comment


    def create_task(post, user):
        result = None
        # La première étape va être de créer la Task
        try :
            with transaction.atomic():
                task = Task.objects.create(title = post.get('title'),
                                            description = post.get('description'),
                                            need_someone = post.get('need_someone'),
                                            id_type_task = TaskType.objects.get(pk=post.get('id_type_task')),
                                            author = user)


                if post.get('resident') is not None:
                    task.resident.add(*post.get('resident'))
                if post.get('room') is not None:
                    task.room.add(*post.get('room'))
                if post.get('receiver_user') is not None:
                    task.receiver_user.add(*post.get('receiver_user'))
                if post.get('receiver_group') is not None:
                    task.receiver_group.add(*post.get('receiver_group'))
                if post.get('copyreceiver_user') is not None:
                    task.copyreceiver_user.add(*post.get('copyreceiver_user'))
                if post.get('copyreceiver_group') is not None:
                    task.copyreceiver_group.add(*post.get('copyreceiver_group'))

                start_date = post.get('start_date')
                end_date = post.get('end_date')
                eventType = post.get('eventType')
                # Si la date de fin est plus petite que la date de début, cela ne joue pas !
                if start_date is None:
                    raise
                if end_date is not None:
                    if end_date < start_date :
                        raise


                # Les valeurs de base pour chaque cas
                data_dict = {}
                data_dict['start_date'] = start_date
                data_dict['end_date'] = end_date
                data_dict['eventType'] = eventType
                data_dict['time'] = post.get('time')
                data_dict['task'] = task

                # Dans le cas d'un ajout d'une tâche non périodique
                if eventType == 0 :
                    # On n'a pas besoin de mettre d'autres valeurs
                    pass
                # Dans le cas d'un ajout d'une tâche périodique
                elif eventType == 1 :
                    periodicType = post.get('periodicType')
                    data_dict['periodicType'] = periodicType
                    # Dans le cas : Quotidien
                    if periodicType == 0:
                        # Rien de spécifique
                        pass
                    # Dans le cas : Hebdomadaire
                    elif periodicType == 1:
                        if post.get('daysOfWeek') is None or post.get('intervalWeek') is None:
                            raise
                        #data_dict['daysOfWeek'] = post.get('daysOfWeek')
                        data_dict['intervalWeek'] = post.get('intervalWeek')
                    # Dans le cas : Mensuel
                    elif periodicType == 2:
                        monthlyType = post.get('monthlyType')
                        data_dict['monthlyType'] = monthlyType
                        # Répétition selon un jour
                        if monthlyType == 0:
                            if post.get('dayNumber') is None or post.get('intervalMonth') is None:
                                raise
                            data_dict['dayNumber'] = post.get('dayNumber')
                            data_dict['intervalMonth'] = post.get('intervallMonth')
                        # Répépition selon le combien-t-ième jour
                        elif monthlyType == 1:
                            if post.get('weekNumber') is None or post.get('daysOfWeek') is None or post.get('intervalMonth') is None:
                                raise
                            data_dict['weekNumber'] = post.get('weekNumber')
                            #data_dict['daysOfWeek'] = post.get('daysOfWeek')
                            data_dict['intervalMonth'] = post.get('intervalMonth')
                        else:
                            raise

                    # Dans le cas : Annuel
                    elif periodicType == 3:
                        # Rien de spécifique
                        pass
                    # Cas pas possible
                    else:
                        raise

                # Pour une mauvaise valeur dans eventType
                else :
                    raise

                # On fait l'ajout selon les valeurs gardées
                result = TaskDate.objects.create(**data_dict)

                # On doit encore ajouter les dépendances avec weeksOfDay si c'est nécessaire

                if eventType == 1:
                    if periodicType == 1 or (periodicType == 2 and monthlyType == 1):
                        result.daysOfWeek.add(*post.get('daysOfWeek'))

        except Exception as e:
            #return "prout"
            #print('%s (%s)' % (e.message, type(e)))
            transaction.rollback()
            return None

        return result



def get_groups(self):
    return self.sectors.all()

User.add_to_class('get_groups', get_groups)

def get_tasks_for_a_day(self, date, group, resident):
    # Récupérer toutes les TaskDate où la date se situe après le début et avant la fin
    # TODO : A optimiser
    if resident is None :
        TaskDates =  TaskDate.objects.filter(
            Q(start_date__lte = date)
            &
            (Q(end_date__gte = date) | Q(end_date__isnull = True))
            &
            (
            Q(task__receiver_user = self.id) | Q(task__copyreceiver_user = self.id) |
            Q(task__receiver_group = group.id) | Q(task__copyreceiver_group = group.id)
            )).distinct()
    else :
        TaskDates =  TaskDate.objects.filter(
            Q(start_date__lte = date)
            &
            (Q(end_date__gte = date) | Q(end_date__isnull = True))
            &
            Q(task__resident = resident)
            ).distinct()


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
                if Day.objects.get(pk=date.weekday()) in taskdate.daysOfWeek.all() :
                # Se répète chaque semaine
                    if taskdate.intervalWeek == 1 | taskdate.intervalWeek is None:
                        # on doit juste regarder si on est le bon jour de la semaine
                        isToAdd = True
                    # Se répète chaque x semaines
                    else :
                        dt = datetime.strptime(str(date.date()), '%Y-%m-%d')
                        newdate = dt - datetime2.timedelta(days=dt.weekday())
                        while newdate.date() <= date.date():
                            enddate = newdate + datetime2.timedelta(days=6)
                            if date.date() >= newdate.date() and date.date() <= enddate.date() :
                                isToAdd = True
                                break
                            newdate += datetime2.timedelta(days=7 * taskdate.intervalWeek)

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
                                new_date = datetime2.date(year,month,1)

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
                                    # ATTENTION A CHANGER ICI, PETIT PROBLEME
                                    new_date = datetime2.date(year,month,1)

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
        if(index in accurateTaskDates):
            accurateTaskDates.remove(index)

    return accurateTaskDates

User.add_to_class('get_tasks_for_a_day', get_tasks_for_a_day)
