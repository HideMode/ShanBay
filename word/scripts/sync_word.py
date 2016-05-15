# -*- coding: utf-8 -*-
"""
    将json文件中的数据存到数据库中
"""
import requests
import json
import os
from django.db import transaction, IntegrityError
from word.models import (Word, EnDefinition, Audio, Pronunciation, Example, Note, EnDefn)



# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
print(BASE_DIR)

def process_data(data):
    data = data['data']['reviews']
    print('len', len(data))
    try:
        sid = transaction.savepoint()
        for item in data:
            content = item['content']
            if Word.objects.filter(content=content).count():
                obj = Word.objects.filter(content=content).last()
                if not obj.en_definition.count():
                    for sub in item['en_definitions']:
                        en = EnDefinition.objects.create(pos=sub)
                        # content = []
                        for s in list(item['en_definitions'][sub]):
                            en.defn.add(EnDefn.objects.create(content=s))
                        obj.en_definition.add(en)

            else:
                print('UPDATE DATA')
                obj = Word.objects.create(content=content, cn_definition=item['cn_definition'].get('defn', '') if item['cn_definition'] else '')
                Pronunciation.objects.create(word=obj, us=item['pronunciations'].get('us', ''), uk=item['pronunciations'].get('uk', ''))
                for sub in item['en_definitions']:
                    en = EnDefinition.objects.create(pos=sub)
                        # content = []
                    for s in list(item['en_definitions'][sub]):
                        en.defn.add(EnDefn.objects.create(content=s))
                    obj.en_definition.add(en)

            if not obj.audio_set.count():
                # print('download mp3')
                if item['uk_audio']:
                    uk_audio_filepath = save_files('uk', item['content'], item['uk_audio'])

                if item['us_audio']:
                    us_audio_filepath = save_files('us', item['content'], item['us_audio'])
                Audio.objects.create(word=obj, us_audio=us_audio_filepath, uk_audio=uk_audio_filepath)
        transaction.savepoint_commit(sid)
    except IntegrityError:
        transaction.savepoint_rollback(sid)
    except Exception,e:
        msg = unicode(e)
        print('error', msg)
        transaction.savepoint_rollback(sid)          


def save_files(tp, word, url):
    filepath = '%s/media/audio/%s/%s.mp3' % (BASE_DIR, tp, word)
    relative_path = '/media/audio/%s/%s.mp3' % (tp, word)
    with open(BASE_DIR + '/media/audio/'+ tp +'/'+word+'.mp3', 'wb') as handle:
        response = requests.get(url, stream=True)

        if response.ok:
            # Something went wrong
            for block in response.iter_content(1024):
                handle.write(block)
            # return filepath
            return relative_path
    return None

def serialize_data(file_name):
    """
    """
    filepath = '%s/data/%s' % (BASE_DIR, file_name)
    print('filepath',filepath)
    with open(filepath, 'r') as f:
        data = json.loads(f.read())
        process_data(data)

# data = requests.get('', stream=True)

# serialize_data(BASE_DIR + '/data/data1.json')