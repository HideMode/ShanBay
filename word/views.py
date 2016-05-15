# -*- coding: utf-8 -*-
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.core import serializers
from rest_framework import permissions, viewsets, status, views
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import filters
from authentication.permissions import IsAccountOwner
from word.permissions import IsNoteOwner
from authentication.serializers import AccountSerializer

from .models import Word, EnDefinition, Level, Note
from authentication.models import Account
from .serializers import WordSerializer, ExampleSerializer, NoteSerializer
import json
# Create your views here.

class WordPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 10

class ExamplePagination(PageNumberPagination):
    page_size = 1
    page_size_query_param = 'page_size'
    max_page_size = 999


class WordViewSet(viewsets.ReadOnlyModelViewSet):
    """
    没有加入限制, 用作搜索
    """
    queryset = Word.objects.all()
    serializer_class = WordSerializer
    search_fields = ('content', 'cn_definition')
    filter_backends = (filters.SearchFilter,)
    pagination_class = WordPagination


class UserWordAPI(GenericAPIView):
    """
    user every days words api
    """
    serializer_class = WordSerializer
    pagination_class = WordPagination

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated():
            return user.level.word.order_by('?')
        return None

    def get(self, request):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serialized = self.serializer_class(data, many=True)
        return Response(serialized.data)


class ExampleViewSet(views.APIView):
    queryset = []
    serializer_class = ExampleSerializer
    pagination_class = ExamplePagination

    def get_queryset(self):
        word_id = self.request.query_params.get('word_id', None)
        if word_id is not None:
            try:
                w_obj = Word.objects.get(pk=word_id)
                return w_obj.example.all()
            except Exception, e:
                print('erros', unicode(e))
                return None
        return None

    def get(self, request):
        data = self.get_queryset()
        serialized = self.serializer_class(data, many=True)
        return Response(serialized.data)


class WordOptionsViewSet(views.APIView):
    """
    用户单词设置参数
    """
    def get(self, request):
        #  序列化单词分类选项以及每日单词数
        levels = Level.objects.values('id', 'name')
        word_num_list = getattr(Account, 'WORD_NUM')
        word_num = []
        for item in word_num_list:
            word_num.append({'id': item[0], 'num': item[1]})

        return Response({'levels': levels, 'msg': 'ok', 'word_num': word_num})

    def post(self, request):
        """
        update user word settings (level and word_num)
        """
        data = request.data
        print('data', data)
        if request.user.is_authenticated():
            user = self.request.user
            try:
                user.level_id = data.get('level', None)
                user.word_num = data.get('word_num', 1)
                user.save()
                serialized = AccountSerializer(user)
                return Response(serialized.data)
            except Exception, e:
                print('errors', unicode(e))
                return Response({
                    'message': u'服务器出错'
                })
            
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class NoteViewSet(viewsets.ModelViewSet):
    """
    note view set
    """
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.IsAuthenticated(),)

        if self.request.method == "POST":
            return (permissions.IsAuthenticated(), IsAccountOwner(),)
        if self.request.method == "PUT":
            return (permissions.IsAuthenticated(), IsNoteOwner(),)

        return (permissions.IsAuthenticated(),)

    def get_queryset(self):
        wordId = self.request.query_params.get('word_id', "0")
        my = self.request.query_params.get('my', "0")
        if wordId != '0':
            # get my note
            if my == '0':
                return Word.objects.get(id=wordId).note.exclude(user=self.request.user)
            else: # get other user note
                return Word.objects.get(id=wordId).note.filter(user=self.request.user)
        return self.queryset

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        wordObj = Word.objects.get(id=request.query_params.get('word_id'))
        # get data before validations
        data = serializer.initial_data
        if serializer.is_valid():
            # save data with current user
            # serializer.save(user=request.user)

            # use django model create
            obj = Note.objects.create(user=request.user, **serializer.validated_data)
            wordObj.note.add(obj)
            return Response(self.serializer_class(obj).data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': '笔记无法创建.',
            'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, partial=True,*args, **kwargs):
        return super(NoteViewSet, self).update(request, partial, *args, **kwargs)