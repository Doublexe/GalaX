"""GalaX URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from login import views
'''Cause these six functions are mainly part so in whole urls,if not right,change it.'''
urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^map/', include('map.urls')),
    url(r'^user_information/', include('user_information.urls')),
    

    url(r'^index/', views.index),
    url(r'^login/', views.login),
    url(r'^register/', views.register),
    url(r'^logout/', views.logout),
    url(r'^passchg/', views.passchg),
    url(r'^confirm/$', views.user_confirm),
    
    url(r'^captcha', include('captcha.urls'))
]
