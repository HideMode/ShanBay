from django.contrib import admin
from .models import *
# Register your models here.

class LevelAdmin(admin.ModelAdmin):
    list_display = ('name',)

admin.site.register(Level, LevelAdmin)


# class EnDefinitionInline(admin.StackedInline):
#     model = EnDefinition
#     fields = ('pos', 'defn',)
#     show_change_link = True

class PronunciationInline(admin.StackedInline):
    model = Pronunciation
    fields = ('us', 'uk')

class WordAdmin(admin.ModelAdmin):
    list_display = ('content', 'cn_definition')
    search_fields = ('content', 'cn_definition')
    inlines = (PronunciationInline,)


admin.site.register(Word, WordAdmin)