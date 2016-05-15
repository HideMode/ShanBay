from django.contrib.auth import update_session_auth_hash

from rest_framework import serializers

from .models import Account


class BaseAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('username',)
        read_only_fields = ('username',)

class AccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Account
        fields = ('email', 'username', 'avatar', 'created_at', 'updated_at', 'level', 'word_num', 
                  'tagline', 'password', 'confirm_password')
        read_only_fields = ('created_at', 'updated_at',)

    def create(self, validated_data):
        return Account.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # update user word level and word_num
        instance.level = validated_data.get('level', instance.level)
        instance.word_num = validated_data.get('word_num', instance.word_num)
        instance.save()

        password = validated_data.get('password', None)
        confirm_password = validated_data.get('confirm_password', None)

        if password and confirm_password and password == confirm_password:
            instance.set_password(password)
            instance.save()

        update_session_auth_hash(self.context.get('request'), instance)

        return instance