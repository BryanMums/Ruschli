from django.db import models
from django.contrib.auth.models import User

# Entity User
# Pour le moment, le modèle de base. A voir si nécessaire d'en faire un ou juste créer un profil.

# Entity Group
class Group(models.Model):
    title = models.CharField(max_length=30)
    description = models.TextField(null=True)
    users = models.ManyToManyField(User)

    def __str__(self):
        return self.title


# Entity Room
class Room(models.Model):
    title = models.CharField(max_length=30)
    number = models.IntegerField(null=True)
    floor = models.IntegerField(null=True)

    def __str__(self):
        return self.title


# Entity Resident
class Resident(models.Model):
    firstname = models.CharField(max_length=40)
    lastname = models.CharField(max_length=40)
    image = models.ImageField(upload_to='residents', null=True) # A voir si on garde.
    birthdate = models.DateField()
    room = models.ForeignKey(Room, null=True)
    comment = models.TextField(null=True)
    allergies = models.TextField(null=True)
    medications = models.TextField(null=True)
    contact_name = models.CharField(max_length=80)
    contact_phone = models.CharField(max_length=15)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.firstname + " " + self.lastname


# Entity TaskType
class TaskType(models.Model):
    name = models.CharField(max_length=50)
    group = models.ManyToManyField(Group)
    default_title = models.CharField(max_length=60, null=True)
    change_title = models.BooleanField(default=True)
    default_description =  models.TextField(null=True)
    change_description = models.BooleanField(default=True)
    default_resident = models.ManyToManyField(Resident, blank=True)
    change_resident = models.BooleanField(default=True)
    default_room = models.ManyToManyField(Room, blank=True)
    change_room = models.BooleanField(default=True)
    default_receiver_user = models.ManyToManyField(User, blank=True, related_name="tasktype_receiver_users")
    change_receiver_user = models.BooleanField(default=True)
    default_receiver_group = models.ManyToManyField(Group, blank=True, related_name="tasktype_receiver_groups")
    change_receiver_group = models.BooleanField(default=True)
    default_copyreceiver_user = models.ManyToManyField(User, blank=True, related_name="tasktype_copyreceiver_users")
    change_copyreceiver_user = models.BooleanField(default=True)
    default_copyreceiver_group = models.ManyToManyField(Group, blank=True, related_name="tasktype_copyreceiver_groups")
    change_copyreceiver_group = models.BooleanField(default=True)
    default_need_someone = models.BooleanField(default=False)
    change_need_someone = models.BooleanField(default=True)

    def __str__(self):
        return self.name


# Entity Task
class Task(models.Model):
    id_type_task = models.ForeignKey(TaskType)
    title = models.CharField(max_length=60)
    description = models.TextField(null=True)
    resident = models.ManyToManyField(Resident, blank=True)
    room = models.ManyToManyField(Room, blank=True)
    receiver_user = models.ManyToManyField(User, blank=True, related_name="task_receiver_users")
    receiver_group = models.ManyToManyField(Group, blank=True, related_name="task_receiver_groups")
    copyreceiver_user = models.ManyToManyField(User, blank=True, related_name="task_copyreceiver_users")
    copyreceiver_group = models.ManyToManyField(Group, blank=True, related_name="task_copyreceiver_groups")
    author = models.ForeignKey(User, related_name="task_authors")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    need_someone = models.BooleanField(default=False)

    def __str__(self):
        return self.title


# Entity TaskDate
class TaskDate(models.Model):
    parent = models.ForeignKey('self', null=True)
    eventType = models.IntegerField(default=0)
    start_date = models.DateField()
    end_date = models.DateField(null=True)
    time = models.TimeField(null=True)
    task = models.ForeignKey(Task)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "De : " + self.start_date + " à " + self.end_date + " : " + self.task.title


# Entity Comment
class Comment(models.Model):
    author = models.ForeignKey(User)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    text = models.TextField()
    taskdate = models.ForeignKey(TaskDate)

    def __str__(self):
        return self.text
