#-*- coding: utf-8 -*-
import sys
from django.core.management.base import BaseCommand, CommandError
from word.scripts.sync_word import serialize_data
from word.scripts.sync_example import sync_example_data

class Command(BaseCommand):
    help = 'sync data'

    def handle(self, *args, **options):
        file_name_list = ['data1.json', 'data1.json']
        print('download start')
        for file_name in file_name_list
            serialize_data(file_name)
            sync_example_data(file_name)
        print('download end')