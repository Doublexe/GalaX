from django.apps import AppConfig


class LoginConfig(AppConfig):
    name = 'login'
    verbose_name = u"登录与用户模块"
    verbose_name_plural = u"登录与用户模块"
    def ready(self):
        from actstream import registry
        registry.register(self.get_model('User'))