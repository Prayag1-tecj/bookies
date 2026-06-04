from rest_framework import serializers
from .models import Book


class BookUploadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book

        fields = [
            "id",
            "title",
            "file",
            "file_type",
            "file_size_mb",
            "status",
        ]

        read_only_fields = [
            "status",
            "file_size_mb",
        ]


class BookListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book

        fields = [
            "id",
            "title",
            "file_type",
            "file_size_mb",
            "status",
            "created_at",
        ]