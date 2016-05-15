# -*- coding: utf-8 -*-
from django.db import models
from filebrowser.fields import FileBrowseField

# Create your models here.


class CommonSupport(models.Model):
    likes = models.IntegerField(u'喜欢', default=0)
    unlikes = models.IntegerField(u'不喜欢', default=0)
    user = models.ForeignKey('authentication.Account', verbose_name=u'创建人', null=True)
    create_at = models.DateTimeField(u'创建时间', auto_now_add=True)

    class Meta:
        abstract = True
        ordering = ['-create_at']


class Level(models.Model):
    """
    Word level: cet4 , cet6, 
    """
    name = models.CharField(u'等级名称', max_length=20)
    word = models.ManyToManyField('Word', verbose_name=u'单词')

    class Meta:
        verbose_name = u'等级'
        verbose_name_plural = u'等级管理'

    def __unicode__(self):
        return '{0}'.format(self.name)



class Word(models.Model):
    """
    Word Model
    """
    content = models.CharField(u'英文', max_length=40)
    en_definition = models.ManyToManyField('EnDefinition', verbose_name=u'英文定义')
    cn_definition = models.CharField(max_length=500, verbose_name=u'中文定义', null=True, blank=True)
    example = models.ManyToManyField('Example', verbose_name=u'例句') 
    note = models.ManyToManyField('Note', verbose_name=u'笔记')
    def get_pronunciation(self):
        return Pronunciation.objects.filter(word=self)

    def get_audio(self):
        return Audio.objects.filter(word=self)

    def __unicode__(self):
        return '%s %s' % (self.content, self.cn_definition)

    class Meta:
        verbose_name = u'单词'
        verbose_name_plural = u'单词管理'


class EnDefinition(models.Model):
    """
    英文定义
    """
    pos = models.CharField(u'词性', max_length=10)
    defn = models.ManyToManyField('EnDefn', verbose_name=u'英文定义')

    class Meta:
        verbose_name = u'英文定义'
        verbose_name_plural = u'英文定义管理'

    def __unicode__(self):
        return '{0}, {1}'.format(self.pos, self.defn)


class EnDefn(models.Model):
    """
    英文定义m2m
    """
    content = models.CharField(u'英文定义', max_length=500)

    def __unicode__(self):
        return self.content


class Audio(models.Model):
    """
    Word Audio Model 
    """
    word = models.ForeignKey('Word', verbose_name=u'单词')
    us_audio = models.CharField(max_length=200, verbose_name=u'美式发音', null=True)
    uk_audio = models.CharField(max_length=200, verbose_name=u'英式发音', null=True)

    class Meta:
        verbose_name = u'发音'
        verbose_name_plural = u'发音管理'


class Pronunciation(models.Model):
    """
    Word pronunciations model with US and uk fields
    """
    word = models.ForeignKey('Word', verbose_name=u'单词')
    us = models.CharField(max_length=40, verbose_name=u'美式发音')
    uk = models.CharField(max_length=40, verbose_name=u'英式发音')

    class Meta:
        verbose_name = u'发音'
        verbose_name_plural = u'发音管理'


class Example(CommonSupport):
    """
    System Word Example Model
    """
    annotation = models.CharField('例句', max_length=500)
    translation = models.CharField('译文', max_length=500)

    class Meta:
        verbose_name = u'例句'
        verbose_name_plural = u'例句管理'

    def __unicode__(self):
        return '{0} {1}'.format(self.annotation, self.translation)


class Note(CommonSupport):
    """
    User-shared Note Model
    """
    content = models.TextField()

    class Meta:
        verbose_name = u'用户笔记'
        verbose_name_plural = u'用户笔记管理'

    def __unicode__(self):
        return self.content