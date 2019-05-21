from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^like$', views.like, name='like'),
    url(r'^user_basic$', views.user_basic, name='user_basic'),
    url(r'^repost$', views.repost, name='repost'),
    url(r'^category$', views.category, name='category'),
    url(r'^comment$', views.comment, name='comment'),
    url(r'^is_login$', views.is_login, name='is_login'),
    url(r'^to_event$', views.to_event, name='to_event'),
]