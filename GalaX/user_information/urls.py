from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='user_information_main_page'),
    #暂未加载 url(r'^user_comment/', views.user_comment, name='user_information_comment'),
    # 用户信息修改
    url('edit/(?P<id>[0-9]+)/', views.profile_edit, name='profile_edit'),
    # 用户信息查看
    url('view/(?P<id>[0-9]+)/', views.profile_view, name='profile_view'),
    url('view/(?P<id>[0-9]+)/(?P<option>[\w]+)', views.event_view, name='event_view'),
    
]