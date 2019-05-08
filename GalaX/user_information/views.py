from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# Create your views here.
from django.http import HttpResponse
from .forms import ProfileForm
from login.models import User
from .models import Profile
def index(request):
    return render(request, 'UserInformation/index.html', locals())

def user_comment(request):
    return render(request, 'UserInformation/UserComment.html', locals())

@login_required #查看是否已经登陆
def profile_edit(request,id):
    user = User.objects.get(id=id)
    # user_id 是 OneToOneField 自动生成的字段
    profile = Profile.objects.get(user_id=id)

    if request.method == 'POST':
        # 验证修改数据者，是否为用户本人
        if request.user != user:
            return HttpResponse("你没有权限修改此用户信息。")

        profile_form = ProfileForm(data=request.POST)
        if profile_form.is_valid():
            # 取得清洗后的合法数据
            profile_cd = profile_form.cleaned_data
            profile.phone = profile_cd['phone']
            profile.bio = profile_cd['bio']
            profile.save()
            # 带参数的 redirect()
            return redirect("UserInformation:edit", id=id)
        else:
            return HttpResponse("注册表单输入有误。请重新输入~")

    else: #request.method == 'GET'
        profile_form = ProfileForm()
        context = { 'profile_form': profile_form, 'profile': profile, 'user': user }
        return render(request, 'UserInformation/edit.html', context)