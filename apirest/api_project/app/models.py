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


class Day(models.Model):
    '''
    Entité "Jour", elle est simplement utiliser pour sélectionner des jours dans
    la semaine lorsqu'on crée une tâche périodique hebdomadaire ou mensuel.

    Les données de cette entité sont créées par une "fixture", il ne faudra rien
    changer ni ajouter d'autres jours. C'est une solution pas optimale mais qui
    permet de faire ce que l'on a besoin et qui permet d'avoir une bonne visualisation
    dans l'administration si on veut voir les apparitions (TaskDate).
    '''
    # Champs
    name = CharField(max_length=15)

    def __str__(self):
        return self.name

class Group(models.Model):
    '''
    Entité "Secteur", c'est le groupe de travail dans lequel l'utilisateur peut travailler.

    Il serait peut-être judicieux de renommer en enitié "Sector" par la suite pour ne pas
    confondre avec l'entité "Group" de Django concernant l'user. (Mais il faudrait changer
    partout, application web & mobile compris)
    '''
    # Champs
    title = CharField(max_length=30)
    description = TextField(null=True)

    # Champs relationnels
    users = ManyToManyField(User, related_name='sectors')

    class Meta:
        ordering = ('title',)

    def __unicode__(self):
        return u'%s' % self.pk

    def __str__(self):
        return self.title


class Room(models.Model):
    '''
    Entité "Salle" permettant de représenter une salle ou une chambre de l'établissement.

    Elle peut être utilisée avec un résident pour dire dans quelle chambre il dort ou dans
    une tâche pour spécifier où elle sera faite par exemple.
    '''
    # Champs
    title = CharField(max_length=30)
    number = IntegerField(null=True)
    floor = IntegerField(null=True)


    class Meta:
        ordering = ('title',)

    def __str__(self):
        return self.title

    def __unicode__(self):
        return u'%s' % self.pk


class Resident(models.Model):
    '''
    Entité "Résident" permettant de représenter une personne bénéficiant des services du home.

    Des tâches peuvent y être liées.
    '''
    # Champs
    firstname = CharField(max_length=40)
    lastname = CharField(max_length=40)
    birthdate = DateField()
    comment = TextField(null=True, blank=True)
    allergies = TextField(null=True, blank=True)
    medications = TextField(null=True, blank=True)
    contact_name = CharField(max_length=80, blank=True)
    contact_phone = CharField(max_length=15, blank=True)
    active = BooleanField(default=True)

    # Champs relationnels
    room = ForeignKey(Room, null=True, blank=True)

    class Meta:
        ordering = ('lastname', 'firstname')

    def __str__(self):
        return self.firstname + " " + self.lastname

    def __unicode__(self):
        return u'%s' % self.pk


class TaskType(models.Model):
    '''
    Entité "Type de tâche" permettant de créer des modèles de tâches pouvant être
    créés par les utilisateurs en fonction du secteur dans lequel il travaille.

    Ces types de tâches permettent de simplifier la création de tâche mais également
    de la limiter en spécifiant des champs déjà pré-remplis et si ces champs ont le
    droit d'être modifiés.
    '''
    # Champs
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

    # Champs relationnels
    group = ManyToManyField(Group)
    default_resident = ManyToManyField(Resident, blank=True)
    default_room = ManyToManyField(Room, blank=True)
    default_receiver_user = ManyToManyField(User, blank=True, related_name="tasktype_receiver_users")
    default_receiver_group = ManyToManyField(Group, blank=True, related_name="tasktype_receiver_groups")
    default_copyreceiver_user = ManyToManyField(User, blank=True, related_name="tasktype_copyreceiver_users")
    default_copyreceiver_group = ManyToManyField(Group, blank=True, related_name="tasktype_copyreceiver_groups")

    class Meta:
        ordering = ('name',)

    def __str__(self):
        return self.name

    def __unicode__(self):
        return u'%s' % self.pk



class Task(models.Model):
    '''
    Entité "Tâche" représente une tâche, un message, une information ou un événement.

    Elle ne concerne uniquement les informations qui ne sont pas liées à l'apparition
    dans le temps (Ceci est la TaskDate).
    '''
    # Champs
    title = CharField(max_length=60)
    description = TextField(null=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    need_someone = BooleanField(default=False)

    # Champs relationnels
    id_type_task = ForeignKey(TaskType, null=True, blank=True)
    resident = ManyToManyField(Resident, blank=True)
    room = ManyToManyField(Room, blank=True)
    receiver_user = ManyToManyField(User, blank=True, related_name="task_receiver_users")
    receiver_group = ManyToManyField(Group, blank=True, related_name="task_receiver_groups")
    copyreceiver_user = ManyToManyField(User, blank=True, related_name="task_copyreceiver_users")
    copyreceiver_group = ManyToManyField(Group, blank=True, related_name="task_copyreceiver_groups")
    author = ForeignKey(User, related_name="task_authors")

    class Meta:
        ordering = ('title',)

    def __unicode__(self):
        return u'%s' % self.pk


class TaskDate(models.Model):
    '''
    Entité "Apparition" permettant de représenter une tâche dans le temps.

    Elle permet notamment de faire qu'une tâche soit non-périodique ou
    périodique (quotidien, hebdomadaire, mensuel ou annuel).

    Elle permet également d'avoir un système d'apparition "Exception", une Exception
    est l'état d'une tâche à une date précise mais qui correspond à une apparition périodique.
    '''

    # Les deux types d'événements
    EVENT_TYPES = (
        (0, 'Non périodique'),
        (1, 'Périodique'),
    )
    # Les types de périodicité
    PERIODIC_TYPES = (
        (0, 'Quotidien'),
        (1, 'Hebdomadaire'),
        (2, 'Mensuel'),
        (3, 'Annuel'),
    )
    # Les types de périodicité mensuelle
    MONTHLY_TYPES = (
        (0, 'Date du jour répété'),
        (1, 'Quel jour de quelle semaine dans le mois')
    )
    # Les combientièmes semaines d'un mois
    WEEK_NUMBER = (
        (0, 'Première'),
        (1, 'Deuxième'),
        (2, 'Troisième'),
        (3, 'Quatrième'),
        (4, 'Cinquième'),
    )

    # Champs
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


    # Champs relationnels
    parent = ForeignKey('self', null=True, blank=True)
    task = ForeignKey(Task)
    daysOfWeek = ManyToManyField(Day, blank=True)
    taker = ForeignKey(User, related_name='task_takers', null=True, blank=True)

    class Meta:
        ordering = ('-pk',)

    def __unicode__(self):
        return u'%s' % self.pk

    def __str__(self):
        return self.task.title + " : " + str(self.id)


    def is_an_exception_or_nonperiodic(self):
        '''
        Méthode permettant de savoir si une apparition est une exception ou non-périodique.
        '''
        if self.eventType == 0 or (self.eventType == 1 and self.parent != None):
            return True
        else:
            return False


    def can_comment(self, user, sector):
        '''
        Méthode permettant de savoir si un utilisateur peut commenter une apparition (une tâche à une certaine date)
        Si l'utilisateur est l'auteur de la tâche, parmis les personnes ou dans le secteur à qui la tâche est destinée
        ou s'il est administrateur
        '''
        return user is self.task.author or user in (self.task.receiver_user.all() or self.task.copyreceiver_user.all()) \
         or sector in (self.task.receiver_group.all() or self.task.copyreceiver_group.all()) \
         or user.is_superuser

    def can_take(self, user, sector):
        '''
        Méthode permettant de savoir si un utilisateur peut s'occuper d'une tâche.
        C'est-à-dire qu'il est parmi les utilisateurs à qui la tâche est destinée ou qu'il
        travaille dans le secteur à qui la tâche est directement destinée.
        '''
        return user in self.task.receiver_user.all() or sector in self.task.receiver_group.all()

    def can_modify(self, user):
        '''
        Méthode permettant de savoir si un utilisateur peut modifier la tâche ou apparition.
        C'est-à-dire s'il est administrateur ou créateur de la tâche.
        '''
        return user.is_superuser or user is self.task.author


class Comment(models.Model):
    '''
    Entité "Commentaire" permettant de représenter un commentaire sur une tâche
    à une date, donc à une apparition.
    '''
    # Champs
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    text = TextField()

    # Champs relationnels
    author = ForeignKey(User, related_name='comments')
    taskdate = ForeignKey(TaskDate, related_name='comments')

    class Meta:
        ordering = ('-pk',)

    def __unicode__(self):
        return u'%s' % self.pk


class TaskManager(models.Manager):
    '''
    Le manageur de tâche. C'est ici que sera implémenté la grosse partie "intelligence"
    '''

    @staticmethod
    def create_an_exception(taskDate, date):
        '''
        Méthode permettant de créer une exception par rapport à une apparition et une date.
        '''
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
        '''
        Méthode permettant de mettre à jour les champs relationnels d'une tâche.
        '''
        task.resident.set(values["resident"])
        task.room.set(values["room"])
        task.receiver_user.set(values["receiver_user"])
        task.receiver_group.set(values["receiver_group"])
        task.copyreceiver_user.set(values["copyreceiver_user"])
        task.copyreceiver_group.set(values["copyreceiver_group"])


    @staticmethod
    def copy_task_if_necessary(task):
        '''
        Méthode permettant de copier une tâche si cela est nécessaire.
        C'est-à-dire que si une tâche doit être modifiée mais qu'on ne veut
        pas la changer directement car une apparition à une date antiérieur y
        est liée.
        '''
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
        '''
        Méthode permettant de modifier une tâche et une apparition à une date précise.

        On peut modifier une tâche de différentes manières : Seulement le jour J ou à
        partir du jour J. De ce fait, il faudra peut-être simplement modifier une apparition
        ou en créer une mais également faire de même avec la tâche.

        Le code pourrait être moins répétitif et plus condensé, mais par soucis de compréhension,
        il reste comme ça pour bien voir les différents cas.
        '''
        output = ""
        try :
            with transaction.atomic():
                # TODO : être sûr d'avoir la bonne taskDate à la bonne date. et gérer les daysOfWeek
                taskDate = TaskDate.objects.get(pk=post["taskdate"]) # L'apparition sur laquelle l'utilisateur veut modifier
                date = post["date"] # La date à laquelle on veut modifier
                if not taskDate.can_modify(user):
                    output += "L'utilisateur n'a pas les droits pour modifier."
                    raise

                values = post["values"] # Les valeurs du formulaire pour la modification des informations basiques et de la périodicité.
                onlyAtTheDate = post["onlyAtDate"] # True --> Uniquement le jour J, False --> A partir du jour J

                # Les valeurs passées dans le POST que l'on va trier pour les 2 différentes entités et les filtrer.
                keys_of_task = ['title', 'description', 'need_someone', 'id_type_task']
                keys_of_task_relational_fields = ['resident', 'room', 'receiver_user', 'receiver_group', 'copyreceiver_user', 'copyreceiver_group']
                keys_of_taskDate = ['eventType', 'periodicType', 'monthlyType', 'start_date', 'end_date', 'time', 'intervalWeek', 'dayNumber', 'intervalMonth', 'weekNumber', 'active', 'taker']

                # Création des dictionnaires qui vont servir pour l'ajout/modification
                dict_values_task = { k: values[k] for k in keys_of_task if k in values }
                dict_values_task["author"] = user.pk
                dict_values_task_relational_fields = { k: values[k] for k in keys_of_task_relational_fields if k in values }
                dict_values_taskDate = { k: values[k] for k in keys_of_taskDate if k in values }
                dict_values_taskDate_exception = { k: dict_values_taskDate[k] for k in ['time', 'active', 'taker'] if k in dict_values_taskDate }

                #TODO: Tester si les valeurs pour la périodicité sont corrects.

                # Dans le cas d'une tâche non-périodique et qui n'est pas une exception.
                if taskDate.eventType == 0 and taskDate.parent == None:

                    # Si avec la modification on reste dans une tâche non-périodique
                    if values["eventType"] == 0:
                        # On fait une copie de la tâche (et non taskDate) pour éviter de modifier les anciennes s'il y a besoin
                        taskDate.task = TaskManager().copy_task_if_necessary(taskDate.task)
                        taskDate.save()

                        # On modifie la tâche, informations basiques et champs relationnels
                        Task.objects.filter(pk=taskDate.task.pk).update(**dict_values_task)
                        task = Task.objects.get(pk=taskDate.task.pk)
                        TaskManager().update_relational_fields_task(task, dict_values_task_relational_fields)

                        # On modifie la taskDate
                        TaskDate.objects.filter(pk=taskDate.pk).update(**dict_values_taskDate)

                        # On récupère la taskDate qu'on a modifié pour la retourner
                        return TaskDate.objects.get(pk=taskDate.pk)


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

                            # On applique les modifications pour la TaskDate et les informations basiques de la tâche
                            TaskDate.objects.filter(pk=taskDate.pk).update(**dict_values_taskDate)
                            Task.objects.filter(pk=taskDate.task.pk).update(**dict_values_task)

                            # On met à jour les champs relationnels de la tâche
                            task = Task.objects.get(pk=taskDate.task.pk)
                            TaskManager().update_relational_fields_task(task, dict_values_task_relational_fields)

                            return TaskDate.objects.get(pk=taskDate.pk)


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

                        # On met à jour les champs relationnels de la tâche
                        task = Task.objects.get(pk=taskDate.task.pk)
                        TaskManager().update_relational_fields_task(task, dict_values_task_relational_fields)

                        return TaskDate.objects.get(pk=taskDate.pk)


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

                        # On met à jour les champs relationnels de la tâche
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

                            # Modifier la tâche exception et transformer la tâche copiée en tâche périodique.
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
                elif taskDate.eventType == 1:
                    # Si on veut uniquement modifier le jour J
                    if onlyAtTheDate:
                        # On crée une exception.
                        exception = TaskManager().create_an_exception(taskDate, date)

                        # On modifie l'exception.
                        TaskDate.objects.filter(pk=exception.pk).update(**dict_values_taskDate_exception)
                        exception = TaskDate.objects.get(pk=exception.pk)
                        exception.task = TaskManager().copy_task_if_necessary(exception.task)
                        exception.save()
                        Task.objects.filter(pk=exception.task.pk).update(**dict_values_task)

                        # On met à jour les champs relationnels de la tâche
                        task = Task.objects.get(pk=exception.task.pk)
                        TaskManager().update_relational_fields_task(task, dict_values_task_relational_fields)

                        return TaskDate.objects.get(pk=exception.pk)


                    # Si on veut modifier tous les jours à partir de la date.
                    else:

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

                        # On met à jour les champs relationnels de la tâche
                        task = Task.objects.get(pk=copiedTaskDate.task.pk)
                        TaskManager().update_relational_fields_task(task, dict_values_task_relational_fields)

                        # On modifie la taskdate
                        TaskDate.objects.filter(pk=copiedTaskDate.pk).update(**dict_values_taskDate)
                        return TaskDate.objects.get(pk=copiedTaskDate.pk)


                # Dans un cas impossible.
                else:
                    raise

        # Si une erreur s'est produite
        except Exception as e:
            print(e)
            transaction.rollback()
            return None


    def stop_task(post, user):
        '''
        Méthode permettant d'arrêter ou de supprimer une taskDate selon son type d'apparition.

        Dans le cas d'une tâche non-périodique, vu qu'elle est uniquement à un jour, si on décide
        de la supprimer, on peut tout simplement la supprimer.

        Dans le cas d'une tâche périodique, on peut décider entre désactiver pour un jour ou arrêter
        à partir d'un jour.
        '''
        output = "" #Debug
        try :
            with transaction.atomic():
                #TODO: Vérifier si on a la bonne taskDate par rapport à la date
                taskDate = TaskDate.objects.get(pk=post["taskdate"])
                date = post["date"]
                # On va vérifier si l'utilisateur a les droits pour faire ça.
                if not taskDate.can_modify(user):
                    output += "L'utilisateur n'a pas les droits pour modifier."
                    raise

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
                    print("mdr")
                    # Si c'est une tâche non périodique
                    if parentTaskDate is None:
                        # On va simplement la supprimer (Désactiver pour le moment)
                        taskDate.active = False
                        taskDate.save()
                    # Si c'est une exception
                    else:
                        # Si on veut juste arrêter au jour J, donc l'exception uniquement
                        if typeStop == 0:
                            # On va mettre le champ active à false
                            taskDate.active = False
                            taskDate.save()
                            print("ici")
                        # Si on veut arrêter la tâche périodique
                        elif typeStop == 1:
                            # On va changer le end_date du parent avec le end_date calculé au-dessus.
                            parentTaskDate.end_date = end_date
                            parentTaskDate.save()
                            # On va également supprimer les exceptions APRES le end_date. Les tâches qui ont en parent, le tâche parente.
                            exceptions = TaskDate.objects.filter(Q(parent=parentTaskDate.pk) & Q(start_date__gt=end_date)).delete()


                # Si c'est une tâche périodique
                elif taskDate.eventType == 1:
                    # Si on veut arrêter au jour J, donc l'exception uniquement.
                    if typeStop == 0:
                        # On va commencer par regarder s'il existe une exception à la date voulue, si c'est pas le cas. On crée une exception.
                        exception = TaskDate.objects.filter(Q(parent=taskDate) & Q(start_date=end_date)).first()
                        if exception == None:
                            exception = TaskManager().create_an_exception(taskDate, end_date)
                        # On va mettre le champ active de l'exception à false.
                        exception.active = False
                        exception.save()

                    # Si on veut arrêter la tâche périodique
                    elif typeStop == 1:
                        # On va changer le end_date avec le end_date calculé au-dessus.
                        taskDate.end_date = end_date
                        # On va également supprimer les exceptions APRES le end_date. Les tâches qui ont en parent, le tâche.
                        exceptions = TaskDate.objects.filter(Q(parent=taskDate) & Q(start_date__gt=end_date)).delete()

                return True


        # Si une erreur s'est produite
        except Exception as e:
            transaction.rollback()
            return False


    def add_taker(post, user):
        # On va d'abord voir s'il y a besoin d'un taker ou s'il en existe un.
        taskDate = TaskDate.objects.get(pk=post["taskdate"])
        sector = Group.objects.get(pk=post["sector"])
        if not taskDate.is_an_exception_or_nonperiodic():
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
        if not taskDate.is_an_exception_or_nonperiodic():
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
                        print("mois")
                        print(data_dict['monthlyType'])
                        if monthlyType == 0:
                            print("yes")
                            if post.get('dayNumber') is None or post.get('intervalMonth') is None:
                                print("prout")
                                raise
                            data_dict['dayNumber'] = post.get('dayNumber')
                            data_dict['intervalMonth'] = post.get('intervalMonth')
                            print("mdr")
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
                    # Pour une mauvaise valeur pour le type de périodicité (periodicType)
                    else:
                        raise

                # Pour une mauvaise valeur dans eventType
                else :
                    raise

                # On fait l'ajout selon les valeurs gardées
                print("Oh !")
                result = TaskDate.objects.create(**data_dict)
                print("Ah !")

                # On doit encore ajouter les dépendances avec weeksOfDay si c'est nécessaire

                if eventType == 1:
                    if periodicType == 1 or (periodicType == 2 and monthlyType == 1):
                        result.daysOfWeek.add(*post.get('daysOfWeek'))

        except Exception as e:
            print(e)
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
            (
            (Q(start_date = date) & Q(eventType = 0))
            |
            (Q(start_date__lte = date) & Q(eventType = 1) & (Q(end_date__gte = date) | Q(end_date__isnull = True)))
            )
            &
            (
            Q(task__receiver_user = self.id) | Q(task__copyreceiver_user = self.id) |
            Q(task__receiver_group = group.id) | Q(task__copyreceiver_group = group.id)
            )).distinct()
    else :
        TaskDates =  TaskDate.objects.filter(
            (
            (Q(start_date = date) & Q(eventType = 0))
            |
            (Q(start_date__lte = date) & Q(eventType = 1) & (Q(end_date__gte = date) | Q(end_date__isnull = True)))
            )
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
                        newdate = start_date
                        while newdate <= date.date():
                            enddate = newdate + datetime2.timedelta(days=6)
                            if date.date() >= newdate and date.date() <= enddate:
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
                            print(str(date.day))
                            if taskdate.weekNumber * 7 < date.day <= (taskdate.weekNumber + 1) * 7 :
                                new_date = start_date
                                while new_date <= date.date():
                                    if new_date.month == date.month and new_date.year == date.year:
                                        isToAdd = True
                                        break
                                    month = new_date.month - 1 + taskdate.intervalMonth
                                    year = int(new_date.year + month / 12 )
                                    month = month % 12 + 1
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
