# -*- coding: utf-8 -*-
"""
    将json文件中的单词例句存到数据库中
"""
import requests
import json
import os
from django.db import transaction, IntegrityError
from word.models import (Word, EnDefinition, CnDefinition, Audio, Pronunciation, 
    Example, SharedExample, Note, EnDefn)


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# from requests.auth import AuthBase

# class ShanBayAuth(AuthBase):
#     def __init__(self, csrfmiddlewaretoken):
#         self.csrfmiddlewaretoken = csrfmiddlewaretoken

#     def __call__(self, r):
#         r.headers['X-CSRFToken'] = self.csrfmiddlewaretoken
#         return r

COOKIES = {'csrftoken': 'qLO2envvVICovQ8i4ZPEBrLiLO7HyasQ', 
            'sessionid': 'hjbh7cef0vl6ekb9xihzmrxxjx1fi25z', 
            'auth_token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2UiOjAsImlzX3N0YWZmIjpmYWxzZSwiaWQiOjQ5NDM5MzA1LCJleHAiOjE0NjQwNTkxMDJ9\
.5__qoRLUspUZp-6GpKrl-ebTqCnH431lOUwlG0A4bNk'}


def handle(data):
    data = data['data']['reviews']
    try:
        sid = transaction.savepoint()
        for item in data:
            content = item['content']
            # create examples
            if item['sys_example_ids'] and Word.objects.filter(content=content).count():
                obj = Word.objects.filter(content=content).last()
                ids = ','.join(map(lambda x: str(x), item['sys_example_ids']))
                # get examples form shanbay with logined in user cookies
                result = requests.get('https://www.shanbay.com/api/v1/bdc/example/?ids='+ids, cookies=COOKIES)
                # print(result.text)
                res = json.loads(result.text)
                if res['status_code']:
                    continue
                # structure [{}, {}]
                for sub in res['data']:
                    example_obj = Example.objects.create(translation=sub['translation'], annotation=sub['annotation'])
                    obj.example.add(example_obj)
            # create notes
            if item['content_id'] and Word.objects.filter(content=content).count():
                obj = Word.objects.filter(content=content).last()
                content_id = str(item['content_id'])
                result = requests.get('https://www.shanbay.com/api/v1/bdc/note/?vocabulary_id='+content_id, cookies=COOKIES) 
                res = json.loads(result.text)
                if res['status_code']:
                    continue
                for sub in res['data']:
                    note_obj = Note.objects.create(user_id=1, content=sub['content'])
                    obj.note.add(note_obj)
        transaction.savepoint_commit(sid)
    except IntegrityError:
        transaction.savepoint_rollback(sid)
    except Exception,e:
        msg = unicode(e)
        print('error', msg)
        transaction.savepoint_rollback(sid)          


def sync_example_data(file_name):
    filepath = '%s/data/%s' % (BASE_DIR, file_name)
    print('filepath',filepath)
    with open(filepath, 'r') as f:
        data = json.loads(f.read())
        handle(data)