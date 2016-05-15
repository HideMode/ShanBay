# -*- coding: utf-8 -*-

from rest_framework import serializers

from .models import Word, EnDefinition, Pronunciation, Audio, EnDefn, Example, Note
from authentication.serializers import BaseAccountSerializer

class EnDefnSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnDefn
        fields = ('content',)


class EnDefinitionSerializer(serializers.ModelSerializer):

    defn = EnDefnSerializer(read_only=True, many=True, required=False)

    class Meta:
        model = EnDefinition
        fields = ('pos', 'defn')


class AudioSerializer(serializers.ModelSerializer):

    class Meta:
        model = Audio
        fields = ('us_audio', 'uk_audio')


class PronunciationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Pronunciation
        fields = ('us', 'uk')


class ExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Example
        fields = ('annotation', 'translation')


class NoteSerializer(serializers.ModelSerializer):
    user = BaseAccountSerializer(required=False)
    class Meta:
        model = Note
        fields = ('id', 'user', 'content',)
        read_only = ('id', 'user')

    def create(self, validated_data):
        return Note.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.content = validated_data.get('content', instance.content)
        instance.save()

        return instance


class WordSerializer(serializers.ModelSerializer):
    """
    """
    audio = AudioSerializer(source="get_audio", read_only=True, required=False, many=True)
    pronunciation = PronunciationSerializer(source='get_pronunciation', read_only=True, required=False, many=True)
    en_definition = EnDefinitionSerializer(read_only=True, required=False, many=True)
    
    class Meta:
        model = Word
        fields = ('id', 'content', 'cn_definition', 'en_definition', 'pronunciation', 'audio')