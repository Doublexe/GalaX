from django.apps import AppConfig


class UserInformationConfig(AppConfig):
    name = 'user_information'
    def ready(self):
        from actstream import registry
        registry.register(self.get_model('Profile'))
