from django.shortcuts import render
from django.shortcuts import redirect
from django.conf import settings
from login import forms
# Create your views here.
import hashlib
import datetime
from . import models


def hash_code(s, salt='mysite'):# 加点盐
    h = hashlib.sha256()
    s += salt
    h.update(s.encode())  # update方法只接收bytes类型
    return h.hexdigest()

def make_confirm_string(user):
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    code = hash_code(user.name, now)
    models.ConfirmString.objects.create(code=code, user=user,)
    return code

def send_email(email, code):

    from django.core.mail import EmailMultiAlternatives

    subject = '来自Galax的注册确认邮件'

    text_content = '''感谢注册Galax，这里是Galax管理员。\
                    如果你看到这条消息，说明你的邮箱服务器不提供HTML链接功能，请联系管理员（回复本邮件即可）！'''

    html_content = '''
                    <p>感谢注册，您可以点击下面链接来进行注册:<br>
                    <a href="http://{}/confirm/?code={}" target=blank>点击此进行注册</a><br>
                    这里是Galax，一个专注分享与热点事件的微博！</p>
                    <p>请点击站点链接完成注册确认！</p>
                    <p>此链接有效期为{}天！</p>
                    '''.format('127.0.0.1:8000', code, settings.CONFIRM_DAYS)

    msg = EmailMultiAlternatives(subject, text_content, settings.EMAIL_HOST_USER, [email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()

def index(request):
    pass
    return render(request, 'login/index.html')


def login(request):
    if request.session.get('is_login', None):
        return redirect("/index/")
    if request.method == "POST":
        login_form = forms.UserForm(request.POST)
        message = "请检查填写的内容！"
        if login_form.is_valid():
            username = login_form.cleaned_data['username']
            password = login_form.cleaned_data['password']
            try:
                user = models.User.objects.get(name=username)
                if not user.has_confirmed:
                    message = "该用户还未通过邮件确认！"
                    return render(request, 'login/login.html', locals())
                if user.password == hash_code(password):  # 哈希值和数据库内的值进行比对
                    request.session['is_login'] = True
                    request.session['user_id'] = user.id
                    request.session['user_name'] = user.name
                    return redirect('/index/')
                else:
                    message = "密码不正确！"
            except:
                message = "用户不存在！"
        return render(request, 'login/login.html', locals())

    login_form = forms.UserForm()
    return render(request, 'login/login.html', locals())


def register(request):
    if request.session.get('is_login', None):
        # 登录状态不允许注册！
        return redirect("/index/")
    if request.method == "POST":
        register_form = forms.RegisterForm(request.POST)
        message = "请检查填写的内容！"
        if register_form.is_valid():  # 获取数据
            username = register_form.cleaned_data['username']
            password1 = register_form.cleaned_data['password1']
            password2 = register_form.cleaned_data['password2']
            email = register_form.cleaned_data['email']
            sex = register_form.cleaned_data['sex']
            phone_number=register_form.cleaned_data['phone_number']
            if password1 != password2:  # 判断两次密码是否相同
                message = "两次输入的密码不同！"
                return render(request, 'login/register.html', locals())
            else:
                same_name_user = models.User.objects.filter(name=username)
                if same_name_user:  # 用户名唯一
                    message = '用户已经存在，请重新选择用户名！'
                    return render(request, 'login/register.html', locals())
                same_email_user = models.User.objects.filter(email=email)
                if same_email_user:  # 邮箱地址唯一
                    message = '该邮箱地址已被注册，请使用别的邮箱！'
                    return render(request, 'login/register.html', locals())
                same_phone_number = models.User.objects.filter(phone_number=phone_number)
                if same_phone_number:  # 电话号码唯一
                    message = '该电话号码已被注册，请使用其它电话号码！'
                    return render(request, 'login/register.html', locals())
                # 当一切都OK的情况下，创建新用户

                new_user = models.User()
                new_user.name = username
                new_user.password = hash_code(password1)  # 使用加密密码
                new_user.email = email
                new_user.sex = sex
                new_user.save()

                code = make_confirm_string(new_user)
                send_email(email, code)

                message = '请前往注册邮箱，进行邮件确认！'
                return render(request, 'login/confirm.html', locals())  # 跳转到等待邮件确认页面。
    register_form = forms.RegisterForm()
    return render(request, 'login/register.html', locals())

def logout(request):
    if not request.session.get('is_login', None):
        # 如果本来就未登录，也就没有登出一说
        return redirect("/index/")
    request.session.flush()
    # 或者使用下面的方法
    # del request.session['is_login']
    # del request.session['user_id']
    # del request.session['user_name']
    return redirect("/index/")

def passchg(request):
    if request.session.get('is_login', None):
    #登陆状态才能修改密码
        if request.method == "POST":
            passchg_form = forms.PWChgForm(request.POST)
            message = "请检查填写的内容！"
            if passchg_form.is_valid():
                password_prime = passchg_form.cleaned_data['password0']
                password1 = passchg_form.cleaned_data['password1']
                password2 = passchg_form.cleaned_data['password2']
                username_session=request.session['user_name']
                user = models.User.objects.get(name=username_session)
                if user.password == hash_code(password_prime):  # 原密码哈希值和数据库内的值进行比对
                    if password1 != password2:  # 判断两次密码是否相同
                        message = "两次输入的密码不同！"
                        return render(request, 'login/passchg.html', locals())
                    if password_prime == password1:
                        message = "新密码应与原密码不同！"
                        return render(request, 'login/passchg.html', locals())
                    else:
                        user.password=hash_code(password1)
                        user.save()
                        message = "密码修改成功！"
                        return render(request, 'login/passchg.html', locals())
                else:
                    message = "原密码不正确！"
                    return render(request, 'login/passchg.html', locals())
        passchg_form = forms.PWChgForm()
        return render(request, 'login/passchg.html', locals())
    #未登陆转登陆界面
    return redirect('/login/')

def user_confirm(request):
    code = request.GET.get('code', None)
    message = ''
    try:
        confirm = models.ConfirmString.objects.get(code=code)
    except:
        message = '无效的确认请求!'
        return render(request, 'login/confirm.html', locals())

    c_time = confirm.c_time
    now = datetime.datetime.now()
    if now > c_time + datetime.timedelta(settings.CONFIRM_DAYS):
        confirm.user.delete()
        message = '您的邮件已经过期！请重新注册!'
        return render(request, 'login/confirm.html', locals())
    else:
        confirm.user.has_confirmed = True
        confirm.user.save()
        confirm.delete()
        message = '感谢确认，请使用账户登录！'
        return render(request, 'login/confirm.html', locals())