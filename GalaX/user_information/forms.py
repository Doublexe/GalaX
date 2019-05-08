# 引入 Profile 模型
from .models import Profile
from django import forms
...
class ProfileForm(forms.Form):
    class Meta:
        model = Profile
        fields = ('phone', 'avatar', 'bio')