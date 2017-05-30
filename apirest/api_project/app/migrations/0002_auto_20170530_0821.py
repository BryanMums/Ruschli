# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-05-30 08:21
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Day',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=15)),
            ],
        ),
        migrations.RemoveField(
            model_name='taskdate',
            name='daysOfWeek',
        ),
        migrations.AddField(
            model_name='taskdate',
            name='daysOfWeek',
            field=models.ManyToManyField(blank=True, null=True, to='app.Day'),
        ),
    ]
