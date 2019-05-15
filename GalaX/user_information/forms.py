# 引入 Profile 模型
from .models import Profile
from django import forms

class ProfileForm(forms.Form):
    # 头像
    #avatar = forms.ImageField(label="头像", required=False)
    # 职业
    job = forms.CharField(max_length=20,label="职业", required=False,error_messages={'max_length': "输入过多字符！"}, widget=forms.TextInput(attrs={'class': 'form-control'}))
    # 名字
    name = forms.CharField(max_length=20,label="名字", required=False,error_messages={'max_length': "输入过多字符！"}, widget=forms.TextInput(attrs={'class': 'form-control'}))
    # 兴趣
    interesting=forms.CharField(max_length=20, label="兴趣", required=False,error_messages={'max_length': "输入过多字符！"}, widget=forms.TextInput(attrs={'class': 'form-control'}))
    # 住所
    location=forms.CharField(max_length=40, label="住址", required=False,error_messages={'max_length': "输入过多字符！"}, widget=forms.TextInput(attrs={'class': 'form-control'}))
    # wechat
    wechat=forms.CharField(max_length=20, label="wechat", required=False,error_messages={'max_length': "输入过多字符！"}, widget=forms.TextInput(attrs={'class': 'form-control'}))
    # QQ
    QQ=forms.IntegerField(max_value=999999999999, label="QQ", required=False,error_messages={'max_value': "QQ号码过长！"}, widget=forms.TextInput(attrs={'class': 'form-control'}))
    # 一句话简介
    biography = forms.CharField(max_length=20, label="个性签名", required=False,error_messages={'max_length': "输入过多字符！"}, widget=forms.TextInput(attrs={'class': 'form-control'}))
    # 个人简介
    bio = forms.CharField(max_length=500, label="个人简介", required=False,error_messages={'max_length': "输入过多字符！"}, widget=forms.TextInput(attrs={'class': 'form-control'}))


"""

class ProfileForm(forms.Form):
    
    class Meta:
        model = Profile
        fields = ['avatar','name', 'interesting','location','wechat','QQ','bio']
        exclude = ['avatar']
        error_messages = {
            'max_length': "输入过多字符！"
        }
        # 自定义 widget，这里使用了长 80 列，宽 20 行的 textarea
        widgets = {
            'name': Textarea(attrs={'cols': 80, 'rows': 20}),
        }
"""
