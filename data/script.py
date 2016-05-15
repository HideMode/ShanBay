# -*- coding: utf-8 -*-
"""
    将json文件中的数据存到数据库中
"""
import requests
import json
import os

from word.models import (Word, EnDefinition, CnDefinition, Audio, Pronunciation, Example, Note)



BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

print(BASE_DIR)

def process_data(data):
    data = data['data']['reviews']
    print('len', len(data))
    for item in data:
        content = item['content']
        print('uk_audio', item['uk_audio'])
        print('us_audio', item['us_audio'])
        obj = Word.objects.create(content=content)
        if item['uk_audio']:
            uk_audio_filepath = save_files('uk', item['content'], item['uk_audio'])

        if item['us_audio']:
            us_audio_filepath = save_files('us', item['content'], item['us_audio'])
            if filepath is not None:
                pass
        Audio.objects.create(word=obj, us_audio=us_audio_filepath, uk_audio=uk_audio_filepath)



def save_files(tp, word, url):
    filepath = '%s/media/audio/%stp/%s.mp3' % (BASE_DIR, tp, word)
    with open(BASE_DIR + '/media/audio/'+ tp +'/'+word+'.mp3', 'wb') as handle:
        response = requests.get(url, stream=True)

        if response.ok:
            # Something went wrong
            for block in response.iter_content(1024):
                handle.write(block)
            return filepath
    return None

def serialize_data(file_name):
    """
    """
    with open(file_name, 'r') as f:
        data = json.loads(f.read())
        process_data(data)

# data = requests.get('', stream=True)


if __name__ == "__main__":
    serialize_data("data1.json")