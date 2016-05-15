# -*- coding: utf-8 -*-
"""
Django settings for ShanBay project.

Generated by 'django-admin startproject' using Django 1.8.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import sys

reload(sys)
sys.setdefaultencoding('utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'eq2+h01qausv$1jxlmh=7j))nxqii81p7ep_@a%ru57u+%j4bh'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = (
    'grappelli',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'ShanBay',
    'authentication',
    'word'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'ShanBay.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ShanBay.wsgi.application'



# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

DATE_FORMAT = 'Y-m-d'

DATETIME_FORMAT = 'Y-m-d H:i'

TIME_FORMAT = 'H:i'

LANGUAGE_CODE = 'zh-hans'

TIME_ZONE = 'Asia/Shanghai'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'

MEDIA_URL = '/media/'

STATIC_ROOT = 'staticfiles'

MEDIA_ROOT = os.path.join(os.path.dirname(__file__), '../media/').replace('\\', '/')

AUTH_USER_MODEL = 'authentication.Account'

SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'



# grappelli
GRAPPELLI_ADMIN_TITLE = u'扇贝单词后台管理系统'

FILEBROWSER_DIRECTORY = 'uploads/'

# Database Settings
DB_NAME = "shanbay"
DB_USER = 'root'
DB_PASSWORD = 'root'
DB_HOST = '127.0.0.1'

if os.environ.get('USER') == "hidemode" or os.environ.get("USERNAME") == 'hidemod':
    DB_USER = "root"
    DB_PASSWORD = '1027'
    DB_HOST = '127.0.0.1'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': DB_NAME,
        'USER': DB_USER,
        'PASSWORD': DB_PASSWORD,
        'HOST': DB_HOST,
        'PORT': '',
    }
}
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static')
]