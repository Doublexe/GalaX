from django.contrib import admin
# Register your models here.

from django.contrib import admin
from login.models import *

from user_information.models import Profile

# 定义一个行内 admin
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'UserProfile'

# 将 Profile 关联到 User 中
class UserAdmin(admin.ModelAdmin):
    inlines = [ProfileInline]
    search_fields = ('username',)
    model= User

# 重新注册 User
#admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(ConfirmString)