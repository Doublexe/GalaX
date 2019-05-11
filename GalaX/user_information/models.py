from django.db import models
from login.models import User
# 引入内置信号
from django.db.models.signals import post_save
# 引入信号接收器的装饰器
from django.dispatch import receiver
# Create your models here.
import os
# Receive the pre_delete signal and delete the file associated with the model instance.


#profile
class Profile(models.Model):
    # 与 User 模型构成一对一的关系
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    # 电话号码字段
    #phone = models.CharField(max_length=20, blank=True)
    # 头像
    avatar = models.ImageField(upload_to='avatar/%Y%m%d/', blank=True)
    # 职业
    job = models.CharField(max_length=20, blank=True)
    # 名字
    name = models.CharField(max_length=20, blank=True)
    # 兴趣
    interesting=models.CharField(max_length=20, blank=True)
    # 住所
    location=models.CharField(max_length=40, blank=True)
    # wechat
    wechat=models.CharField(max_length=20, blank=True)
    # QQ
    QQ=models.CharField(max_length=20, blank=True)
    # 个人简介
    bio = models.TextField(max_length=500, blank=True)
    # 一句话简介
    biography=models.TextField(max_length=20, blank=True)
    # 收藏(微博模型没出来)
    
    # 转发(微博模型没出来)
    
    def __str__(self):
        return 'user {}'.format(self.user.username)

    def remove_on_image_update(self):
        try:
            # is the object in the database yet?
            obj = Profile.objects.get(id=self.id)
        except Profile.DoesNotExist:
            # object is not in db, nothing to worry about
            return
        # is the save due to an update of the actual image file?
        if obj.avatar and self.avatar and obj.avatar != self.avatar:
            # delete the old avatar file from the storage in favor of the new file
            obj.avatar.delete()

    def delete(self, *args, **kwargs):
        # object is being removed from db, remove the file from storage first
        self.avatar.delete()
        return super(Profile, self).delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        # object is possibly being updated, if so, clean up.
        self.remove_on_image_update()
        return super(Profile, self).save(*args, **kwargs)


    
# 信号接收函数，每当新建 User 实例时自动调用
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


# 信号接收函数，每当更新 User 实例时自动调用
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()