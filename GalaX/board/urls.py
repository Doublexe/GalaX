from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^like$', views.like, name='like'),
    url(r'^repost$', views.repost, name='repost'),
    url(r'^is_login$', views.is_login, name='is_login'),
]