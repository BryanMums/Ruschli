from django.conf.urls import url, include
from rest_framework import routers
from rest_framework.authtoken import views as rviews
from . import api
from . import views

router = routers.DefaultRouter()
router.register(r'group', api.GroupViewSet)
router.register(r'room', api.RoomViewSet)
router.register(r'resident', api.ResidentViewSet)
router.register(r'tasktype', api.TaskTypeViewSet)
router.register(r'task', api.TaskViewSet)
router.register(r'taskdate', api.TaskDateViewSet)
router.register(r'comment', api.CommentViewSet)
router.register(r'user', api.UserViewSet)


urlpatterns = (
    # urls for Django Rest Framework API
    url(r'^api/', include(router.urls)),
    url(r'^api-token-auth/', rviews.obtain_auth_token)
)

urlpatterns += (
    # urls for Group
    url(r'^app/group/$', views.GroupListView.as_view(), name='app_group_list'),
    url(r'^app/group/create/$', views.GroupCreateView.as_view(), name='app_group_create'),
    url(r'^app/group/detail/(?P<pk>\S+)/$', views.GroupDetailView.as_view(), name='app_group_detail'),
    url(r'^app/group/update/(?P<pk>\S+)/$', views.GroupUpdateView.as_view(), name='app_group_update'),
)

urlpatterns += (
    # urls for Room
    url(r'^app/room/$', views.RoomListView.as_view(), name='app_room_list'),
    url(r'^app/room/create/$', views.RoomCreateView.as_view(), name='app_room_create'),
    url(r'^app/room/detail/(?P<pk>\S+)/$', views.RoomDetailView.as_view(), name='app_room_detail'),
    url(r'^app/room/update/(?P<pk>\S+)/$', views.RoomUpdateView.as_view(), name='app_room_update'),
)

urlpatterns += (
    # urls for Resident
    url(r'^app/resident/$', views.ResidentListView.as_view(), name='app_resident_list'),
    url(r'^app/resident/create/$', views.ResidentCreateView.as_view(), name='app_resident_create'),
    url(r'^app/resident/detail/(?P<pk>\S+)/$', views.ResidentDetailView.as_view(), name='app_resident_detail'),
    url(r'^app/resident/update/(?P<pk>\S+)/$', views.ResidentUpdateView.as_view(), name='app_resident_update'),
)

urlpatterns += (
    # urls for TaskType
    url(r'^app/tasktype/$', views.TaskTypeListView.as_view(), name='app_tasktype_list'),
    url(r'^app/tasktype/create/$', views.TaskTypeCreateView.as_view(), name='app_tasktype_create'),
    url(r'^app/tasktype/detail/(?P<pk>\S+)/$', views.TaskTypeDetailView.as_view(), name='app_tasktype_detail'),
    url(r'^app/tasktype/update/(?P<pk>\S+)/$', views.TaskTypeUpdateView.as_view(), name='app_tasktype_update'),
)

urlpatterns += (
    # urls for Task
    url(r'^app/task/$', views.TaskListView.as_view(), name='app_task_list'),
    url(r'^app/task/create/$', views.TaskCreateView.as_view(), name='app_task_create'),
    url(r'^app/task/detail/(?P<pk>\S+)/$', views.TaskDetailView.as_view(), name='app_task_detail'),
    url(r'^app/task/update/(?P<pk>\S+)/$', views.TaskUpdateView.as_view(), name='app_task_update'),
)

urlpatterns += (
    # urls for TaskDate
    url(r'^app/taskdate/$', views.TaskDateListView.as_view(), name='app_taskdate_list'),
    url(r'^app/taskdate/create/$', views.TaskDateCreateView.as_view(), name='app_taskdate_create'),
    url(r'^app/taskdate/detail/(?P<pk>\S+)/$', views.TaskDateDetailView.as_view(), name='app_taskdate_detail'),
    url(r'^app/taskdate/update/(?P<pk>\S+)/$', views.TaskDateUpdateView.as_view(), name='app_taskdate_update'),
)

urlpatterns += (
    # urls for Comment
    url(r'^app/comment/$', views.CommentListView.as_view(), name='app_comment_list'),
    url(r'^app/comment/create/$', views.CommentCreateView.as_view(), name='app_comment_create'),
    url(r'^app/comment/detail/(?P<pk>\S+)/$', views.CommentDetailView.as_view(), name='app_comment_detail'),
    url(r'^app/comment/update/(?P<pk>\S+)/$', views.CommentUpdateView.as_view(), name='app_comment_update'),
)

urlpatterns += (
    url(r'^api/get_connected_user/$', views.get_connected_user),
)

urlpatterns += (
    url(r'^api/tasks/(?P<date_url>\d{4}-\d{2}-\d{2})/(?P<group_id>\S+)/$', views.get_tasks_for_a_day),
    url(r'^api/tasks_resident/(?P<date_url>\d{4}-\d{2}-\d{2})/(?P<resident_id>\S+)/$', views.get_tasks_for_a_day_resident),
)

urlpatterns += (
    url(r'^api/residents/active', views.get_residents_active),
)

urlpatterns += (
    url(r'^app/test/create', views.test_create),
)
