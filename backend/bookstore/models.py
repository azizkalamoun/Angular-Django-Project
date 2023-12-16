from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    def __str__(self):
        return self.name 
class Category(models.Model):
    name = models.CharField(max_length=50)
    def __str__(self):
        return self.name 

class Book(models.Model):
    title = models.CharField(max_length=50)
    author = models.CharField(max_length=50)
    year = models.CharField(max_length=50)
    description = models.TextField()
    image_link = models.CharField(max_length=250)
    categories = models.ManyToManyField(Category)
    rating = models.FloatField(default=0.0)  
    def __str__(self):
        return self.title 

class Contact(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    def __str__(self):
        return self.user 

class Cart(models.Model):
    user_profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE)
    books = models.ManyToManyField(Book)

    def __str__(self):
        return str(self.user_profile)



class Quote(models.Model):
    text = models.TextField()

    def __str__(self):
        return self.text