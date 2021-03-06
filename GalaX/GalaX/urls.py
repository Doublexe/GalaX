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
from django.conf import settings
from django.conf.urls.static import static
'''Cause these six functions are mainly part so in whole urls,if not right,change it.'''
urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^map/', include('map.urls')),
    url(r'^board/', include('board.urls')),
    url(r'^user_information/', include('user_information.urls'),name='user_information'),
    

    url(r'^index/', views.index),
    url(r'^login/', views.login,name='login'),
    url(r'^register/', views.register,name='register'),
    url(r'^logout/', views.logout),
    url(r'^passchg/', views.passchg),
    url(r'^confirm/$', views.user_confirm),
    url(r'password_lost', views.password_lost, name='password_lost'),
    url(r'get_email_code',views.get_email_code, name='get_email_code'),
    
    url(r'^captcha', include('captcha.urls')),
    
    
    # url(r'^activity/', include('actstream.urls')),
    url(r'^search$',views.search,name='search'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
