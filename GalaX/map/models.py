from django.db import models
from django.dispatch import receiver
import os


# Create your models here.

class Event(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    image = models.ImageField()
    summary = models.CharField(max_length=50)
    content = models.CharField(max_length=2000)
    lng = models.DecimalField(db_index=True, max_digits=9, decimal_places=6)
    lat = models.DecimalField(db_index=True, max_digits=9, decimal_places=6)

    def __str__(self):
        return self.name + '_' + str(self.id)


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