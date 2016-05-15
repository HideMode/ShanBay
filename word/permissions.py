# -*- coding: utf-8 -*-
from rest_framework import permissions


class IsNoteOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, note):
        if request.user:
            return note.user == request.user
        return False