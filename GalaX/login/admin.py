from django.contrib import admin

# Register your models here.
from . import models


admin.site.site_header = 'Galax后台'

admin.site.index_title = '作者：胡成伟 唐应天 柳蕴珂'
#admin.site.register(models.User)
#admin.site.register(models.ConfirmString)