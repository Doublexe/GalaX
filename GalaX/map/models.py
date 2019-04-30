from django.db import models
from django.dispatch import receiver

from login.models import User


# Create your models here.

class Event(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)

    # Content
    image = models.ImageField()
    summary = models.CharField(max_length=50)
    content = models.CharField(max_length=2000)

    # GEO
    c_time = models.DateTimeField(auto_now_add=True)
    lng = models.DecimalField(db_index=True, max_digits=9, decimal_places=6)
    lat = models.DecimalField(db_index=True, max_digits=9, decimal_places=6)

    # Function
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    # https://docs.djangoproject.com/en/2.2/ref/models/fields/#django.db.models.Field.null
    repost = models.ForeignKey("Event", on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        return self.name + '_' + str(self.id)

    class Meta:
        ordering = ["-c_time"]
        verbose_name = "事件"
        verbose_name_plural = "事件"


class Like(models.Model):
    id = models.AutoField(primary_key=True)

    event = models.ForeignKey(Event, on_delete=models.DO_NOTHING)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    c_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user) + '_like_' + str(self.event)

    class Meta:
        ordering = ["-c_time"]
        verbose_name = "喜欢"
        verbose_name_plural = "喜欢"


class Comment(models.Model):
    id = models.AutoField(primary_key=True)

    event = models.ForeignKey(Event, on_delete=models.DO_NOTHING)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    c_time = models.DateTimeField(auto_now_add=True)

    comment = models.CharField(max_length=2000)

    def __str__(self):
        return str(self.user) + '_like_' + str(self.event)

    class Meta:
        ordering = ["-c_time"]
        verbose_name = "评论"
        verbose_name_plural = "评论"


# delete file when delete the corresponding filefield entry
# https://stackoverflow.com/questions/16041232/django-delete-filefield

# These two auto-delete files from filesystem when they are unneeded:

@receiver(models.signals.post_delete, sender=Event)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `Event` object is deleted.
    """
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)

@receiver(models.signals.pre_save, sender=Event)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    Deletes old file from filesystem
    when corresponding `Event` object is updated
    with new file.
    """
    if not instance.pk:
        return False

    try:
        old_file = Event.objects.get(pk=instance.pk).file
    except Event.DoesNotExist:
        return False

    new_file = instance.image
    if not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)