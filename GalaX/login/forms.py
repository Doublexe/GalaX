from django import forms
from captcha.fields import CaptchaField
from captcha.fields import CaptchaTextInput
from django.core.exceptions import ValidationError
class UserForm(forms.Form):
    username = forms.CharField(label="用户名", max_length=128, widget=forms.TextInput(attrs={'class': 'form-control'}))
    password = forms.CharField(label="密码", max_length=12, widget=forms.PasswordInput(attrs={'class': 'form-control'}))
    captcha = CaptchaField(label='验证码', widget=CaptchaTextInput(attrs={'class': 'form-control'}))

class RegisterForm(forms.Form):
    gender = (
        ('male', "男"),
        ('female', "女"),
    )
    username = forms.CharField(
        label="用户名",
        min_length=2,
        max_length=16,
        error_messages={'required': '用户名不能为空.',
                        #'invalid': '密码必须至少包含数字和字母',
                        'min_length': "用户名不能少于2个字符",
                        'max_length': "用户名不能大于16个字符"},
        widget=forms.TextInput(attrs={'class': 'form-control','placeholder': '至少2个字符，可以是中文'}))
    #password1 = forms.CharField(label="密码", max_length=12, widget=forms.PasswordInput(attrs={'class': 'form-control'}))
    password1 = forms.RegexField(
        '^(?=.*[0-9])(?=.*[a-zA-Z]).{6,12}$',   #这里正则匹配验证要求密码了里面至少包含字母、数字
        label="密码",
        min_length=6,
        max_length=12,
        error_messages={'required': '密码不能为空.',
                        'invalid': '密码必须至少包含数字和字母',
                        'min_length': "密码长度不能小于6个字符",
                        'max_length': "密码长度不能大于12个字符"},
        widget=forms.PasswordInput(attrs={'class': 'form-control',
        'placeholder': '密码6-12个字符，需要至少包含数字和字母'}
                                )
    )
    password2 = forms.CharField(label="确认密码", max_length=12, widget=forms.PasswordInput(attrs={'class': 'form-control','placeholder': '请再次输入密码'}))
    phone_number = forms.CharField(
        label="电话号码",
        min_length=6,
        max_length=15,
        widget=forms.NumberInput(attrs={'class': 'form-control','placeholder': '电话号码'}))
    email = forms.EmailField(label="邮箱地址", widget=forms.EmailInput(attrs={'class': 'form-control','placeholder': '请输入邮箱'}))
    sex = forms.ChoiceField(label='性别', choices=gender)
    captcha = CaptchaField(label='验证码', widget=CaptchaTextInput(attrs={'class': 'form-control'}))
    
class PWChgForm(forms.Form):
    password0 = forms.CharField(label="原密码", max_length=12, widget=forms.PasswordInput(attrs={'class': 'form-control','placeholder': '请输入原密码'}))
    password1 = forms.RegexField(
        '^(?=.*[0-9])(?=.*[a-zA-Z]).{6,12}$',   #这里正则匹配验证要求密码了里面至少包含字母、数字
        label="密码",
        min_length=6,
        max_length=12,
        error_messages={'required': '密码不能为空.',
                        'invalid': '密码必须至少包含数字和字母',
                        'min_length': "密码长度不能小于6个字符",
                        'max_length': "密码长度不能大于12个字符"},
        widget=forms.PasswordInput(attrs={'class': 'form-control','placeholder': '密码6-12个字符，需要至少包含数字和字母'})
    )
    password2 = forms.CharField(label="确认密码", max_length=12, widget=forms.PasswordInput(attrs={'class': 'form-control','placeholder': '再次输入密码'}))

class ForgetPwdForm(forms.Form):
    """Forget the password and try to find it"""
    email = forms.EmailField(label=u'用户邮箱', 
        widget=forms.EmailInput(attrs={'class':'form-control', 'id':'email','placeholder':u'请输入您注册时用的邮箱'}))
    password1 = forms.RegexField(
        '^(?=.*[0-9])(?=.*[a-zA-Z]).{6,12}$',   #这里正则匹配验证要求密码了里面至少包含字母、数字
        label=u'新密码', 
        min_length=6,
        max_length=12,
        error_messages={'required': '密码不能为空.',
                        'invalid': '密码必须至少包含数字和字母',
                        'min_length': "密码长度不能小于6个字符",
                        'max_length': "密码长度不能大于12个字符"},
        widget=forms.PasswordInput(attrs={'class':'form-control', 'id':'password1','placeholder':u'请输入6-36位的密码'}))
    password2 = forms.CharField(
        label=u'确认密码', 
        min_length=6,
        max_length=12,
        widget=forms.PasswordInput(attrs={'class':'form-control', 'id':'password2','placeholder':u'重复新的密码确保正确'}))
    captcha = CaptchaField(label=u'验证码', widget=CaptchaTextInput(attrs={'class': 'form-control'}))
 
    #验证邮箱是否存在
    def clean_email(self):
        email = self.cleaned_data.get('email')
        users = User.objects.filter(email = email)
 
        if users.count() == 0:
            raise ValidationError(u'该邮箱没有被注册，请检查')
        return email
 
    #验证两个新密码是否一致
    def clean_pwd_2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
 
        if password1 != password2:
            raise ValidationError(u'两次输入的密码不一致，再输入一次吧')
        return password2
 
    #验证验证码是否正确
    def clean_check_code(self):
        try:
            #获取对应的用户
            email = self.cleaned_data.get('email')
            check_code = self.cleaned_data.get('check_code')
            user = User.objects.get(email = email)
 
            #获取对应的用户拓展信息，验证验证码
            user_ex = User_ex.objects.filter(user = user)
            if user_ex.count > 0:
                user_ex = user_ex[0]
            else:
                raise ValidationError(u'未获取验证码')
            
            if user_ex.valid_code != check_code:
                raise ValidationError(u'验证码不正确')
            
            #验证有效期
            now = timezone.now() #用这个回去当前时间
            create = user_ex.valid_time
 
            #两个datetime相减，得到datetime.timedelta类型
            td = now - create
            if td.seconds/60 >= 10:
                raise ValidationError(u'验证码失效')
 
            return check_code
        except Exception as e:
            raise ValidationError(u'验证码不正确或失效')