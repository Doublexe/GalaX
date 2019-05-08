from django.db import models

from django.contrib.auth.models import AbstractUser
# Create your models here.


#class User(models.Model):
class User(AbstractUser):
    gender = (
        ('male', "男"),
        ('female', "女"),
    )
    
    username = models.CharField(max_length=128, unique=True)
    password = models.CharField(max_length=256)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(unique=True, max_length=15)
    sex = models.CharField(max_length=32, choices=gender, default="男")
    c_time = models.DateTimeField(auto_now_add=True)
    has_confirmed = models.BooleanField(default=False)


    def __str__(self):
        return self.username
    class Meta:
        ordering = ["-c_time"]
        verbose_name = "用户"
        verbose_name_plural = "用户"

class ConfirmString(models.Model):
    code = models.CharField(max_length=256)
    user = models.OneToOneField('User')
    c_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username + ":   " + self.code

    #class Meta:
    class Meta(AbstractUser.Meta):

        ordering = ["-c_time"]
        verbose_name = "确认码"
        verbose_name_plural = "确认码"

class PWDReset(models.Model):
    """Password Reset"""
    user = models.ForeignKey('User')  #和User关联的外键
    valid_code = models.CharField(max_length = 24)   #验证码
    valid_time = models.DateTimeField(auto_now = True) #验证码有效时间
 
    def __unicode__(self):
        return u'%s' % (self.valid_code)