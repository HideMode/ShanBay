# -*- coding: utf-8 -*-
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import ugettext_lazy as _


class AccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('Users must have a valid email address.')

        if not kwargs.get('username'):
            raise ValueError('Users must have a valid username.')

        account = self.model(
            email=self.normalize_email(email), username=kwargs.get('username')
        )

        account.set_password(password)
        account.save()

        return account

    def create_superuser(self, email, password, **kwargs):
        account = self.create_user(email, password, **kwargs)
        account.is_superuser = True
        account.is_staff = True
        account.save()

        return account


class Account(AbstractBaseUser, PermissionsMixin):
    """
    user model
    """
    WORD_NUM = ((1, 40), (2, 60), (3, 100))
    email = models.EmailField(u'邮箱', unique=True)
    username = models.CharField(u'用户名', max_length=40, unique=True)
    avatar = models.ImageField(u'头像', default="users/avatar.jpg", upload_to="users/avatar", max_length=200)

    tagline = models.CharField(u'标语', max_length=140, blank=True)
    is_staff = models.BooleanField(u'员工状态', default=False)
    is_active = models.BooleanField(u'是否有效', default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    level = models.ForeignKey('word.Level', verbose_name=u'单词级别', null=True, blank=True)
    word_num = models.IntegerField(u'每日单词数', choices=WORD_NUM, default=1)

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name=u"用户帐号"
        verbose_name_plural = u"用户帐号管理"
        swappable = 'AUTH_USER_MODEL'

    def __unicode__(self):
        return self.email

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username