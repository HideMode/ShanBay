# -*- coding: utf-8 -*-
from django.conf.urls import include, url
from django.contrib import admin

from django.conf.urls.static import static
from django.conf import settings

from rest_framework_nested import routers
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from filebrowser.sites import site

from authentication.views import (AccountViewSet, LoginView, LogoutView, CurrentUserView, UserUploadImageView, CheckUserPasswordView)
from word.views import WordViewSet, WordOptionsViewSet, ExampleViewSet, NoteViewSet, UserWordAPI
from .views import IndexView
admin.autodiscover()

# register rest framework urls
router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'words', WordViewSet)
router.register(r'notes', NoteViewSet)

urlpatterns = [

    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^api/v1/user/words/$', UserWordAPI.as_view(), name='user_word_api'),
    url(r'^api/v1/options/$', WordOptionsViewSet.as_view(), name='WordOptions'),
    url(r'^api/v1/examples/$', ExampleViewSet.as_view(), name='ExampleView'),
    # grappelli urls
    url(r'^grappelli/', include('grappelli.urls')), 
    # file-browser urls
    url(r'^admin/filebrowser/', include(site.urls)),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', IndexView.as_view(), name='index'),

]

urlpatterns += [
    url(r'^account/currentuser/$', CurrentUserView.as_view(), name="CurrentUser"),
    url(r'^account/uploadimage/$', UserUploadImageView.as_view(), name="UploadImage"),
    url(r'^account/checkpassword/$', CheckUserPasswordView.as_view(), name="CheckPassword")
]

urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)