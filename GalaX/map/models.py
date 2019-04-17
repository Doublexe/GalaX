from django.db import models


# Create your models here.

class Event(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    image = models.ImageField()
    summary = models.CharField(max_length=50)
    content = models.CharField(max_length=2000)
    lng = models.DecimalField(db_index=True, max_digits=9, decimal_places=6)
    lat = models.DecimalField(db_index=True, max_digits=9, decimal_places=6)
