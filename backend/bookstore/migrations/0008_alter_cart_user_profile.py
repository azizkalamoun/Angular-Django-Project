# Generated by Django 4.1.7 on 2023-12-13 00:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bookstore', '0007_remove_cart_user_cart_user_profile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cart',
            name='user_profile',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bookstore.userprofile'),
        ),
    ]
