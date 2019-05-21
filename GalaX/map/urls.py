from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^nearby$', views.nearby, name='nearby'),
    url(r'^upload$', views.upload, name='upload'),
    url(r'^to_event/(?P<id>[0-9]+)/', views.to_event, name='to_event')
]