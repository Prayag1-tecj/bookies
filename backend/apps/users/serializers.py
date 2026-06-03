from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password"
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user


class ProfileSerializer(serializers.ModelSerializer):
    plan = serializers.CharField(
        source="profile.plan"
    )

    books_uploaded = serializers.IntegerField(
        source="profile.books_uploaded"
    )

    questions_today = serializers.IntegerField(
        source="profile.questions_today"
    )

    storage_used_mb = serializers.FloatField(
        source="profile.storage_used_mb"
    )

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "plan",
            "books_uploaded",
            "questions_today",
            "storage_used_mb",
        ]