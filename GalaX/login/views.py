from django.shortcuts import render_to_response, render,redirect
from django.conf import settings
from login import forms
# Create your views here.
import hashlib
import datetime
from . import models
import json, time, datetime, random, string
from django.core.mail import EmailMultiAlternatives
from django.http import HttpResponse
from django.utils import timezone
from django.core.urlresolvers import reverse
from django.contrib.auth import authenticate
from django.contrib.auth import login as login_django
from django.contrib.auth import logout as  logout_django
from django.core.paginator import Paginator
from map.models import Event
from django.db.models import Q

def getPages(request, objectlist):
    """get the paginator"""
    currentPage = request.GET.get('page', 1)
    
    paginator = Paginator(objectlist, 6)
    objectlist = paginator.page(currentPage)
 
    return paginator, objectlist



def search(request):
    search = request.GET.get('search')
    
    # 用户搜索逻辑
    if search:
        event_list = Event.objects.filter(
                Q(name__icontains=search) |
                Q(summary__icontains=search) |
                Q(content__icontains=search)
            )
    else:
        # 将 search 参数重置为空
        search = ''
        event_list = Event.objects.all()
    print(event_list)
    paginator = Paginator(event_list, 3)
    current_page = request.GET.get('page',1)
    event_list = paginator.page(current_page)
    print("to p:",event_list)
    # 增加 search 到 context
    context = { 'event_list': event_list, 'search': search }

    return render(request, 'login/search.html', context)


def hash_code(s, salt='mysite'):# 加点盐
    h = hashlib.sha256()
    s += salt
    h.update(s.encode())  # update方法只接收bytes类型
    return h.hexdigest()

def make_confirm_string(user):
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    code = hash_code(user.username, now)
    models.ConfirmString.objects.create(code=code, user=user,)
    return code

def send_email(email, code,function_code):

    from django.core.mail import EmailMultiAlternatives
    text_content = '''感谢注册Galax，这里是Galax管理员。\
                        如果你看到这条消息，说明你的邮箱服务器不提供HTML链接功能，请联系管理员（回复本邮件即可）！'''
                        
    if function_code=='register':
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
    elif function_code=='passReset':
        subject = '来自Galax的密码重置邮件'
        html_content = '''
                        <p>感谢使用！您可以使用以下验证码来进行密码重置:<br>
                        <em>{}</em><br>
                        这里是Galax，一个专注分享与热点事件的微博！</p>
                        <p>请点击站点链接即可重置密码！</p>
                        <p>此验证码有效期为10分钟！</p>
                        '''.format(code)
    else:
        pass

    msg = EmailMultiAlternatives(subject, text_content, settings.EMAIL_HOST_USER, [email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()

def index(request):
    pass
    return redirect("/board/")


def login(request):
    if request.session.get('is_login', None):
        #如果已经登陆
        return redirect("/board/")
    if request.method == "POST":
        login_form = forms.UserForm(request.POST)
        message = "请检查填写的内容！"
        if login_form.is_valid():
            username = login_form.cleaned_data['username']
            password = login_form.cleaned_data['password']
            try:
                user = models.User.objects.get(username=username)
                if not user.has_confirmed:
                    message = "还未通过邮件确认！"
                    return render(request, 'login/login.html', locals())
                if user.password == hash_code(password):  # 哈希值和数据库内的值进行比对
                    request.session['is_login'] = True
                    request.session['user_id'] = user.id
                    request.session['user_name'] = user.username
                    login_django(request, user)
                    return redirect('/index/')
                else:
                    message = "密码不正确！"
            except:
                message = "用户不存在！"
        return render(request, 'login/login.html', locals())
    else:
        login_form = forms.UserForm()
    return render(request, 'login/login.html', locals())


def register(request):
    if request.session.get('is_login', None):
        # 登录状态不允许注册！
        return redirect("/board/")
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
                same_name_user = models.User.objects.filter(username=username)
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
                new_user.username = username
                new_user.password = hash_code(password1)  # 使用加密密码
                new_user.email = email
                new_user.phone_number = phone_number
                new_user.sex = sex
                new_user.save()
                code = make_confirm_string(new_user)
                send_email(email, code,function_code='register')

                message = '请前往注册邮箱，进行邮件确认！'
                return render(request, 'login/confirm.html', locals())  # 跳转到等待邮件确认页面。
        else:#is not valid
            pass
    else:
        register_form = forms.RegisterForm()
    return render(request, 'login/register.html', locals())

def logout(request):
    if not request.session.get('is_login', None):
        # 如果本来就未登录，也就没有登出一说
        return redirect("/board/")
    request.session.flush()
    logout_django(request)
    # 或者使用下面的方法
    # del request.session['is_login']
    # del request.session['user_id']
    # del request.session['user_name']
    return redirect("/board/")

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
                user = models.User.objects.get(username=username_session)
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
        else:
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

def password_lost(request):
    """forgot password deals"""
    data = {}
    data['form_title'] = u'重置密码'
    data['submit_name'] = u'　确定　'
 
    if request.method == 'POST':
        #表单提交
        form = forms.ForgetPwdForm(request.POST)
        
        #验证是否合法
        if form.is_valid():
            #修改数据库
            email = form.cleaned_data['email']
            pwd = form.cleaned_data['password2']
            user = models.User.objects.get(email = email)
            user.password = hash_code(pwd)
            user.save()
 
            #删除验证码
            ex = models.PWDReset.objects.filter(user=user)
            if ex.count() > 0:
                ex.delete()
 
            #重新登录
            #user = authenticate(username=user.username, password=pwd)
            #if user is not None:
            #    login(request, user)
 
            #页面提示
            data['goto_url'] = reverse('login')
            data['goto_time'] = 3000
            data['goto_page'] = True
            data['message'] = u'重置密码成功，请牢记新密码'
            return render_to_response('login/message.html',data)
    else:
        #正常加载
        form = forms.ForgetPwdForm()
    data['form'] = form
    return render(request, 'login/passReset.html', data)


def get_email_code(request):
    """get email code"""
    email = request.GET.get('email', '')#得到前端文件中的Email地址
    code = ''.join(random.sample(string.digits + string.ascii_letters, 6))
    data = {}
    data['success'] = False
    data['message'] = ''
    print(code)
    try:
        #检查邮箱
        print("check email")
        users = models.User.objects.filter(email = email)
        print(len(users))
        if len(users)==0:
            print("check user==0")
            data['success'] = False
            data['message'] = u'此邮箱未注册'
            raise Exception(data['message'])
        
        user = users[0]
        
        
        #检查短时间内是否有生成过验证码
        user_ex = models.PWDReset.objects.filter(user = user)
        print(len(user_ex))
        if len(user_ex)>0:
            user_ex = user_ex[0]
            print("time is not so long")
            #两个datetime相减，得到datetime.timedelta类型
            create_time = user_ex.valid_time
            td = timezone.now() - create_time
            if td.seconds < 60:
                data['message'] = u'1分钟内发送过一次验证码'
                raise Exception(data['message'])
        else:
            #没有则新建
            print("come to new user")
            user_ex = models.PWDReset(user = user)
            #print(user_ex)
        
        #写入数据库
        user_ex.valid_code = code
        user_ex.valid_time = timezone.now()
        user_ex.save()
        print(user_ex.valid_code)
        print(user_ex.valid_time)
        #发送邮件
        send_email(email, code,function_code='passReset')
        data['success'] = True
        data['message'] = 'OK'
    except Exception as e:
        pass
    finally:
        return HttpResponse(json.dumps(data), content_type="application/json")