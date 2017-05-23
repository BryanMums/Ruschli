import unittest
from django.core.urlresolvers import reverse
from django.test import Client
from .models import Group, Room, Resident, TaskType, Task, TaskDate, Comment
from django.contrib.auth.models import User
from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType


def create_django_contrib_auth_models_user(**kwargs):
    defaults = {}
    defaults["username"] = "username"
    defaults["email"] = "username@tempurl.com"
    defaults.update(**kwargs)
    return User.objects.create(**defaults)


def create_django_contrib_auth_models_group(**kwargs):
    defaults = {}
    defaults["name"] = "group"
    defaults.update(**kwargs)
    return Group.objects.create(**defaults)


def create_django_contrib_contenttypes_models_contenttype(**kwargs):
    defaults = {}
    defaults.update(**kwargs)
    return ContentType.objects.create(**defaults)


def create_group(**kwargs):
    defaults = {}
    defaults["title"] = "title"
    defaults["description"] = "description"
    defaults.update(**kwargs)
    if "users" not in defaults:
        defaults["users"] = create_user()
    return Group.objects.create(**defaults)


def create_room(**kwargs):
    defaults = {}
    defaults["title"] = "title"
    defaults["number"] = "number"
    defaults["floor"] = "floor"
    defaults.update(**kwargs)
    return Room.objects.create(**defaults)


def create_resident(**kwargs):
    defaults = {}
    defaults["firstname"] = "firstname"
    defaults["lastname"] = "lastname"
    defaults["birthdate"] = "birthdate"
    defaults["comment"] = "comment"
    defaults["allergies"] = "allergies"
    defaults["medications"] = "medications"
    defaults["contact_name"] = "contact_name"
    defaults["contact_phone"] = "contact_phone"
    defaults["active"] = "active"
    defaults.update(**kwargs)
    if "room" not in defaults:
        defaults["room"] = create_room()
    return Resident.objects.create(**defaults)


def create_tasktype(**kwargs):
    defaults = {}
    defaults["name"] = "name"
    defaults["default_title"] = "default_title"
    defaults["change_title"] = "change_title"
    defaults["change_description"] = "change_description"
    defaults["change_resident"] = "change_resident"
    defaults["change_room"] = "change_room"
    defaults["change_receiver_user"] = "change_receiver_user"
    defaults["change_receiver_group"] = "change_receiver_group"
    defaults["change_copyreceiver_user"] = "change_copyreceiver_user"
    defaults["change_copyreceiver_group"] = "change_copyreceiver_group"
    defaults["default_need_someone"] = "default_need_someone"
    defaults["change_need_someone"] = "change_need_someone"
    defaults.update(**kwargs)
    if "group" not in defaults:
        defaults["group"] = create_group()
    if "default_resident" not in defaults:
        defaults["default_resident"] = create_resident()
    if "default_room" not in defaults:
        defaults["default_room"] = create_room()
    if "default_receiver_user" not in defaults:
        defaults["default_receiver_user"] = create_user()
    if "default_receiver_group" not in defaults:
        defaults["default_receiver_group"] = create_group()
    if "default_copyreceiver_user" not in defaults:
        defaults["default_copyreceiver_user"] = create_user()
    if "default_copyreceiver_group" not in defaults:
        defaults["default_copyreceiver_group"] = create_group()
    return TaskType.objects.create(**defaults)


def create_task(**kwargs):
    defaults = {}
    defaults["title"] = "title"
    defaults["description"] = "description"
    defaults["updated_at"] = "updated_at"
    defaults["need_someone"] = "need_someone"
    defaults.update(**kwargs)
    if "id_type_task" not in defaults:
        defaults["id_type_task"] = create_tasktype()
    if "resident" not in defaults:
        defaults["resident"] = create_resident()
    if "room" not in defaults:
        defaults["room"] = create_room()
    if "receiver_user" not in defaults:
        defaults["receiver_user"] = create_user()
    if "receiver_group" not in defaults:
        defaults["receiver_group"] = create_group()
    if "copyreceiver_user" not in defaults:
        defaults["copyreceiver_user"] = create_user()
    if "copyreceiver_group" not in defaults:
        defaults["copyreceiver_group"] = create_group()
    if "author" not in defaults:
        defaults["author"] = create_user()
    return Task.objects.create(**defaults)


def create_taskdate(**kwargs):
    defaults = {}
    defaults["eventType"] = "eventType"
    defaults["start_date"] = "start_date"
    defaults["end_date"] = "end_date"
    defaults["time"] = "time"
    defaults["active"] = "active"
    defaults["updated_at"] = "updated_at"
    defaults.update(**kwargs)
    if "parent" not in defaults:
        defaults["parent"] = create_'self'()
    if "task" not in defaults:
        defaults["task"] = create_task()
    return TaskDate.objects.create(**defaults)


def create_comment(**kwargs):
    defaults = {}
    defaults["updated_at"] = "updated_at"
    defaults["text"] = "text"
    defaults.update(**kwargs)
    if "author" not in defaults:
        defaults["author"] = create_user()
    if "taskdate" not in defaults:
        defaults["taskdate"] = create_taskdate()
    return Comment.objects.create(**defaults)


class GroupViewTest(unittest.TestCase):
    '''
    Tests for Group
    '''
    def setUp(self):
        self.client = Client()

    def test_list_group(self):
        url = reverse('app_group_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_create_group(self):
        url = reverse('app_group_create')
        data = {
            "title": "title",
            "description": "description",
            "users": create_user().pk,
        }
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 302)

    def test_detail_group(self):
        group = create_group()
        url = reverse('app_group_detail', args=[group.pk,])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_update_group(self):
        group = create_group()
        data = {
            "title": "title",
            "description": "description",
            "users": create_user().pk,
        }
        url = reverse('app_group_update', args=[group.pk,])
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)


class RoomViewTest(unittest.TestCase):
    '''
    Tests for Room
    '''
    def setUp(self):
        self.client = Client()

    def test_list_room(self):
        url = reverse('app_room_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_create_room(self):
        url = reverse('app_room_create')
        data = {
            "title": "title",
            "number": "number",
            "floor": "floor",
        }
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 302)

    def test_detail_room(self):
        room = create_room()
        url = reverse('app_room_detail', args=[room.pk,])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_update_room(self):
        room = create_room()
        data = {
            "title": "title",
            "number": "number",
            "floor": "floor",
        }
        url = reverse('app_room_update', args=[room.pk,])
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)


class ResidentViewTest(unittest.TestCase):
    '''
    Tests for Resident
    '''
    def setUp(self):
        self.client = Client()

    def test_list_resident(self):
        url = reverse('app_resident_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_create_resident(self):
        url = reverse('app_resident_create')
        data = {
            "firstname": "firstname",
            "lastname": "lastname",
            "birthdate": "birthdate",
            "comment": "comment",
            "allergies": "allergies",
            "medications": "medications",
            "contact_name": "contact_name",
            "contact_phone": "contact_phone",
            "active": "active",
            "room": create_room().pk,
        }
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 302)

    def test_detail_resident(self):
        resident = create_resident()
        url = reverse('app_resident_detail', args=[resident.pk,])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_update_resident(self):
        resident = create_resident()
        data = {
            "firstname": "firstname",
            "lastname": "lastname",
            "birthdate": "birthdate",
            "comment": "comment",
            "allergies": "allergies",
            "medications": "medications",
            "contact_name": "contact_name",
            "contact_phone": "contact_phone",
            "active": "active",
            "room": create_room().pk,
        }
        url = reverse('app_resident_update', args=[resident.pk,])
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)


class TaskTypeViewTest(unittest.TestCase):
    '''
    Tests for TaskType
    '''
    def setUp(self):
        self.client = Client()

    def test_list_tasktype(self):
        url = reverse('app_tasktype_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_create_tasktype(self):
        url = reverse('app_tasktype_create')
        data = {
            "name": "name",
            "default_title": "default_title",
            "change_title": "change_title",
            "change_description": "change_description",
            "change_resident": "change_resident",
            "change_room": "change_room",
            "change_receiver_user": "change_receiver_user",
            "change_receiver_group": "change_receiver_group",
            "change_copyreceiver_user": "change_copyreceiver_user",
            "change_copyreceiver_group": "change_copyreceiver_group",
            "default_need_someone": "default_need_someone",
            "change_need_someone": "change_need_someone",
            "group": create_group().pk,
            "default_resident": create_resident().pk,
            "default_room": create_room().pk,
            "default_receiver_user": create_user().pk,
            "default_receiver_group": create_group().pk,
            "default_copyreceiver_user": create_user().pk,
            "default_copyreceiver_group": create_group().pk,
        }
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 302)

    def test_detail_tasktype(self):
        tasktype = create_tasktype()
        url = reverse('app_tasktype_detail', args=[tasktype.pk,])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_update_tasktype(self):
        tasktype = create_tasktype()
        data = {
            "name": "name",
            "default_title": "default_title",
            "change_title": "change_title",
            "change_description": "change_description",
            "change_resident": "change_resident",
            "change_room": "change_room",
            "change_receiver_user": "change_receiver_user",
            "change_receiver_group": "change_receiver_group",
            "change_copyreceiver_user": "change_copyreceiver_user",
            "change_copyreceiver_group": "change_copyreceiver_group",
            "default_need_someone": "default_need_someone",
            "change_need_someone": "change_need_someone",
            "group": create_group().pk,
            "default_resident": create_resident().pk,
            "default_room": create_room().pk,
            "default_receiver_user": create_user().pk,
            "default_receiver_group": create_group().pk,
            "default_copyreceiver_user": create_user().pk,
            "default_copyreceiver_group": create_group().pk,
        }
        url = reverse('app_tasktype_update', args=[tasktype.pk,])
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)


class TaskViewTest(unittest.TestCase):
    '''
    Tests for Task
    '''
    def setUp(self):
        self.client = Client()

    def test_list_task(self):
        url = reverse('app_task_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_create_task(self):
        url = reverse('app_task_create')
        data = {
            "title": "title",
            "description": "description",
            "updated_at": "updated_at",
            "need_someone": "need_someone",
            "id_type_task": create_tasktype().pk,
            "resident": create_resident().pk,
            "room": create_room().pk,
            "receiver_user": create_user().pk,
            "receiver_group": create_group().pk,
            "copyreceiver_user": create_user().pk,
            "copyreceiver_group": create_group().pk,
            "author": create_user().pk,
        }
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 302)

    def test_detail_task(self):
        task = create_task()
        url = reverse('app_task_detail', args=[task.pk,])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_update_task(self):
        task = create_task()
        data = {
            "title": "title",
            "description": "description",
            "updated_at": "updated_at",
            "need_someone": "need_someone",
            "id_type_task": create_tasktype().pk,
            "resident": create_resident().pk,
            "room": create_room().pk,
            "receiver_user": create_user().pk,
            "receiver_group": create_group().pk,
            "copyreceiver_user": create_user().pk,
            "copyreceiver_group": create_group().pk,
            "author": create_user().pk,
        }
        url = reverse('app_task_update', args=[task.pk,])
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)


class TaskDateViewTest(unittest.TestCase):
    '''
    Tests for TaskDate
    '''
    def setUp(self):
        self.client = Client()

    def test_list_taskdate(self):
        url = reverse('app_taskdate_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_create_taskdate(self):
        url = reverse('app_taskdate_create')
        data = {
            "eventType": "eventType",
            "start_date": "start_date",
            "end_date": "end_date",
            "time": "time",
            "active": "active",
            "updated_at": "updated_at",
            "parent": create_'self'().pk,
            "task": create_task().pk,
        }
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 302)

    def test_detail_taskdate(self):
        taskdate = create_taskdate()
        url = reverse('app_taskdate_detail', args=[taskdate.pk,])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_update_taskdate(self):
        taskdate = create_taskdate()
        data = {
            "eventType": "eventType",
            "start_date": "start_date",
            "end_date": "end_date",
            "time": "time",
            "active": "active",
            "updated_at": "updated_at",
            "parent": create_'self'().pk,
            "task": create_task().pk,
        }
        url = reverse('app_taskdate_update', args=[taskdate.pk,])
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)


class CommentViewTest(unittest.TestCase):
    '''
    Tests for Comment
    '''
    def setUp(self):
        self.client = Client()

    def test_list_comment(self):
        url = reverse('app_comment_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_create_comment(self):
        url = reverse('app_comment_create')
        data = {
            "updated_at": "updated_at",
            "text": "text",
            "author": create_user().pk,
            "taskdate": create_taskdate().pk,
        }
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 302)

    def test_detail_comment(self):
        comment = create_comment()
        url = reverse('app_comment_detail', args=[comment.pk,])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_update_comment(self):
        comment = create_comment()
        data = {
            "updated_at": "updated_at",
            "text": "text",
            "author": create_user().pk,
            "taskdate": create_taskdate().pk,
        }
        url = reverse('app_comment_update', args=[comment.pk,])
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)


