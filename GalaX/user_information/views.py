from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# Create your views here.
from django.http import HttpResponse
from .forms import ProfileForm
from login.models import User
from .models import Profile
from django.views.decorators.csrf import csrf_exempt,csrf_protect
import os
import json
from django.core.files.uploadedfile import SimpleUploadedFile
from django.forms.models import model_to_dict
from django.shortcuts import render_to_response, render,redirect
from actstream.actions import follow, unfollow,is_following
from django.contrib.contenttypes.models import ContentType
from actstream.models import following, followers
from map.models import Event,Like,Comment
from django.core.paginator import Paginator


def index(request):
    print("to index")
    return render(request, 'UserInformation/index.html', locals())

def user_comment(request):
    return render(request, 'UserInformation/UserComment.html', locals())

@csrf_exempt #This skips csrf validation. 
def profile_edit(request,id):
    if request.session.get('is_login', None):#查看是否已经登陆
        #如果已经登陆
        user = User.objects.get(id=id)
        # user_id 是 OneToOneField 自动生成的字段
        profile = Profile.objects.get(user_id=id)
        print("to profile")

        if request.method == 'POST':
            if request.is_ajax():# 如果是AJAX，说明上传头像，否则是提交表格
                name = request.FILES.get('file').name
                image = request.FILES['file']
                profile.avatar=image
                profile.save()
                print("successfully save")
                data={'status':True}
                print(data)
                return HttpResponse(json.dumps(data), content_type="application/json")
            # 验证修改数据者，是否为用户本人
            profile_form = ProfileForm(request.POST)
            if request.session['user_id'] != user.id:
                print("reid: ",request.session['user_id'])
                print("userid: ",user.id)
                message=" 你没有权限修改此用户信息。"
                context = { 'profile_form': profile_form, 'profile': profile, 'user': user,'message':message }
                return render(request, 'UserInformation/profile_edit.html', context)

            if profile_form.is_valid():
                # 取得清洗后的合法数据
                profile_cd = profile_form.cleaned_data
                profile.job = profile_cd['job']
                profile.name = profile_cd['name']
                profile.interesting = profile_cd['interesting']
                profile.location = profile_cd['location']
                profile.wechat = profile_cd['wechat']
                profile.QQ = profile_cd['QQ']
                profile.bio = profile_cd['bio']
                profile.biography = profile_cd['biography']
                
                profile.save()
                # 带参数的 redirect()
                message=" 修改成功！"
                context = { 'profile_form': profile_form, 'profile': profile, 'user': user,'message':message }
                return render(request, 'UserInformation/profile_edit.html', context)
            else:
                message=" QQ号码过长！"
                context = { 'profile_form': profile_form, 'profile': profile, 'user': user,'message':message }
                return render(request, 'UserInformation/profile_edit.html', context)
        else: #request.method == 'GET'
            profile_dict=model_to_dict(profile)
            profile_dict.pop('avatar')
            profile_form = ProfileForm(initial=profile_dict)
            print(profile_dict)
            context = { 'profile_form': profile_form, 'profile': profile, 'user': user }
            return render(request, 'UserInformation/profile_edit.html', context)
    else:
        return redirect("/index/")

@csrf_exempt
def profile_view(request,id):# 这里的request保存的是session中的这个登陆者的信息，id是想要访问的谁的id
    if request.session.get('is_login', None):#查看是否已经登陆
        #如果已经登陆
        user_actions = User.objects.get(id=request.session['user_id'])# 登陆者
        user = User.objects.get(id=id)# 查看的人
        # user_id 是 OneToOneField 自动生成的字段
        profile = Profile.objects.get(user_id=id)
        #if request.method == 'GET':
        profile_dict=model_to_dict(profile)
        profile_dict.pop('avatar')
        profile_form = ProfileForm(initial=profile_dict)
        #profile_form.fields['disabled']=True
        is_following_bit=is_following(user_actions, user)
        print(is_following_bit)
        ContentTypeId=ContentType.objects.get(app_label='login', model='user').id
        followers_list=followers(user) # returns a list of Users who follow id
        total_followers=len(followers_list)
        following_list=following(user) # returns a list of actors who request.user is following
        total_following=len(following_list)
        
        weibo_list=Event.objects.filter(owner=user).values('summary','content')
        
        Like_object=Like.objects.filter(user=user)
        Like_list=Like_object
        repost_list=Event.objects.filter(owner=user,repost__isnull=False).values('summary','content','repostcomment')
        
        # 每页显示 6 个event
        pages = Paginator(weibo_list, 3)
        # 获取 url 中的页码
        current_page = request.GET.get('page_weibo',1)
        # 将导航对象相应的页码内容返回给 articles
        weibo_list = pages.page(current_page)
        
        # 每页显示 6 个event
        pages = Paginator(Like_list, 3)
        # 获取 url 中的页码
        current_page = request.GET.get('page_Like',1)
        # 将导航对象相应的页码内容返回给 articles
        Like_list = pages.page(current_page)
        
        # 每页显示 6 个event
        pages = Paginator(repost_list, 3)
        # 获取 url 中的页码
        current_page = request.GET.get('page_repost',1)
        # 将导航对象相应的页码内容返回给 articles
        repost_list = pages.page(current_page)
        if request.GET.get('page_weibo',0) or request.GET.get('page_Like',0) or request.GET.get('page_repost',0):
            print("respond !!!!!!!!!!!!!!")
            return render_to_response('UserInformation/profile_view.html', locals())
        else:
            return render(request, 'UserInformation/profile_view.html', locals())
    
    else:
        return redirect("/login/")

@login_required
def event_view(request,id):
    #if request.method == 'G':
    user_actions = User.objects.get(id=request.session['user_id'])# 登陆者
    user = User.objects.get(id=id)# 查看的人
    # user_id 是 OneToOneField 自动生成的字段
    profile = Profile.objects.get(user_id=id)
    
    weibo_list=Event.objects.filter(owner=user).values('summary','content')
    Like_object=Like.objects.filter(user=user)
    Like_list=Like_object
    repost_list=Event.objects.filter(owner=user,repost=True).values('summary','content','repostcomment')

    # 每页显示 6 个event
    pages = Paginator(weibo_list, 3)
    # 获取 url 中的页码
    current_page = request.GET.get('page_weibo',1)
    # 将导航对象相应的页码内容返回给 articles
    weibo_list = pages.page(current_page)

    # 每页显示 6 个event
    pages = Paginator(Like_list, 3)
    # 获取 url 中的页码
    current_page = request.GET.get('page_Like',1)
    # 将导航对象相应的页码内容返回给 articles
    Like_list = pages.page(current_page)

    # 每页显示 6 个event
    pages = Paginator(repost_list, 3)
    # 获取 url 中的页码
    current_page = request.GET.get('page_repost',1)
    # 将导航对象相应的页码内容返回给 articles
    repost_list = pages.page(current_page)
    return render_to_response('UserInformation/profile_view.html',locals())


