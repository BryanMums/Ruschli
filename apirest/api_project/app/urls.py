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

# Routes concernant les appels "basiques" à l'API
# Pour le moment, toutes les routes sont activés, mais plus tard il faudra en bloquer certaines
# comme l'ajout des tâches qui doit passer par une autre route.
urlpatterns = (
    url(r'^api/', include(router.urls)),
)

# Route permettant de récupérer les informations de l'utilisateur connecté
urlpatterns += (
    url(r'^api/get_connected_user/$', views.get_connected_user, name='get_connected_user'),
)

# Route permettant de récupérer la liste des tâches pour un utilisateur/secteur ou résident
urlpatterns += (
    url(r'^api/tasks/(?P<date_url>\d{4}-\d{2}-\d{2})/(?P<group_id>\S+)/$', views.get_tasks_for_a_day, name='get_tasks_sector'),
    url(r'^api/tasks_resident/(?P<date_url>\d{4}-\d{2}-\d{2})/(?P<resident_id>\S+)/$', views.get_tasks_for_a_day_resident, name='get_tasks_resident'),
)

# Route permettant de récupérer uniquement les résidents actifs
urlpatterns += (
    url(r'^api/residents/active', views.get_residents_active, name='get_residents_active'),
)

# Route permettant de créer une tâche et apparition (Task et TaskDate)
urlpatterns += (
    url(r'^api/createtask/', views.add_task, name='create_task'),
)

# Route permettant de récupérer les types de tâches d'un secteur
urlpatterns += (
    url(r'^api/tasktypes/(?P<sector_id>\S+)/$', views.get_tasktypes_sector, name='get_tasktypes_sector'),
)

# Route permettant d'ajouter un commentaire à une apparition (TaskDate)
urlpatterns += (
    url(r'^api/addcomment/', views.add_comment, name='add_comment'),
)

# Route permettant d'ajouter un utilisateur qui s'occupe d'une tâche
urlpatterns += (
    url(r'^api/addtaker/', views.add_taker, name='add_taker'),
)

# Route permettant d'arrêter une tâche et apparition
urlpatterns += (
    url(r'^api/stoptask/', views.stop_task, name='stop_task'),
)

# Route permettant de modifier une tâche et apparition
urlpatterns += (
    url(r'^api/updatetask/', views.update_task, name='update_task'),
)
