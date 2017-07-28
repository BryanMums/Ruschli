from django.contrib import admin
from django import forms
from .models import Day, Group, Room, Resident, TaskType, Task, TaskDate, Comment
from django.contrib.auth.models import User
'''
On désactive certaines entitiés qu'on ne veut pas dans l'admin
'''

'''
class DayAdminForm(forms.ModelForm):
    class Meta:
        model = Day
        fields = '__all__'


class DayAdmin(admin.ModelAdmin):
    form = DayAdminForm
    list_display = ['name', 'pk']

admin.site.register(Day, DayAdmin)
'''
class GroupAdminForm(forms.ModelForm):

    class Meta:
        model = Group
        fields = '__all__'


class GroupAdmin(admin.ModelAdmin):
    form = GroupAdminForm
    list_display = ['title', 'description']

admin.site.register(Group, GroupAdmin)


class RoomAdminForm(forms.ModelForm):

    class Meta:
        model = Room
        fields = '__all__'


class RoomAdmin(admin.ModelAdmin):
    form = RoomAdminForm
    list_display = ['title', 'number', 'floor']

admin.site.register(Room, RoomAdmin)


class ResidentAdminForm(forms.ModelForm):

    class Meta:
        model = Resident
        fields = '__all__'


class ResidentAdmin(admin.ModelAdmin):
    form = ResidentAdminForm
    list_display = ['firstname', 'lastname', 'birthdate', 'comment', 'allergies', 'medications', 'contact_name', 'contact_phone', 'active']
admin.site.register(Resident, ResidentAdmin)


class TaskTypeAdminForm(forms.ModelForm):

    class Meta:
        model = TaskType
        fields = '__all__'


class TaskTypeAdmin(admin.ModelAdmin):
    form = TaskTypeAdminForm
    list_display = ['name', 'default_title', 'change_title', 'change_description', 'change_resident', 'change_room', 'change_receiver_user', 'change_receiver_group', 'change_copyreceiver_user', 'change_copyreceiver_group', 'default_need_someone', 'change_need_someone']
    readonly_fields = []

admin.site.register(TaskType, TaskTypeAdmin)

'''
class TaskAdminForm(forms.ModelForm):

    class Meta:
        model = Task
        fields = '__all__'


class TaskAdmin(admin.ModelAdmin):
    form = TaskAdminForm
    list_display = ['title', 'description', 'created_at', 'updated_at', 'need_someone']
    readonly_fields = ['created_at', 'updated_at']

admin.site.register(Task, TaskAdmin)


class TaskDateAdminForm(forms.ModelForm):
    class Meta:
        model = TaskDate
        fields = '__all__'


class TaskDateAdmin(admin.ModelAdmin):
    form = TaskDateAdminForm
    list_display = ['eventType', 'start_date', 'end_date', 'time', 'active', 'created_at', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']

admin.site.register(TaskDate, TaskDateAdmin)


class CommentAdminForm(forms.ModelForm):

    class Meta:
        model = Comment
        fields = '__all__'


class CommentAdmin(admin.ModelAdmin):
    form = CommentAdminForm
    list_display = ['created_at', 'updated_at', 'text']
    readonly_fields = ['created_at', 'updated_at']

admin.site.register(Comment, CommentAdmin)
'''
