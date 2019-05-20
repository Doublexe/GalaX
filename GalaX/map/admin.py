from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Event)
admin.site.register(Like)
admin.site.register(Comment)

"""
class LikeInline(admin.StackedInline):
    model = Like
    can_delete = False
    verbose_name_plural = 'LIKE'

# 将 Like 关联到 Event 中
class EventAdmin(admin.ModelAdmin):
    inlines = [LikeInline]
    search_fields = ('name','summary','content')
    model= Event

# 重新注册 User
#admin.site.unregister(User)
admin.site.register(Event, EventAdmin)
admin.site.register(Comment)
"""