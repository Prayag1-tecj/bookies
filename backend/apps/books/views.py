from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Book
from .serializers import BookUploadSerializer
from django.shortcuts import get_object_or_404
from .serializers import (
    BookUploadSerializer,
    BookListSerializer,
)

MAX_BOOKS = 3
MAX_FILE_SIZE_MB = 5


class BookUploadView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        profile = request.user.profile

        if profile.books_uploaded >= MAX_BOOKS:
            return Response(
                {
                    "error": "Book upload limit reached"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        uploaded_file = request.FILES.get("file")

        if not uploaded_file:
            return Response(
                {
                    "error": "No file uploaded"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        file_size_mb = uploaded_file.size / (
            1024 * 1024
        )

        if file_size_mb > MAX_FILE_SIZE_MB:
            return Response(
                {
                    "error": "File exceeds 5 MB limit"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        extension = uploaded_file.name.split(".")[-1].upper()

        allowed_types = [
            "PDF",
            "EPUB",
            "TXT",
            "DOCX",
        ]

        if extension not in allowed_types:
            return Response(
                {
                    "error": "Unsupported file type"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        book = Book.objects.create(
            title=request.data.get("title"),
            uploaded_by=request.user,
            file=uploaded_file,
            file_type=extension,
            file_size_mb=round(file_size_mb, 2),
        )

        profile.books_uploaded += 1
        profile.storage_used_mb += file_size_mb
        profile.save()

        serializer = BookUploadSerializer(book)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

class BookListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        books = Book.objects.filter(
            uploaded_by=request.user
        ).order_by("-created_at")

        serializer = BookListSerializer(
            books,
            many=True
        )

        return Response(serializer.data)

class BookDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, book_id):

        book = get_object_or_404(
            Book,
            id=book_id,
            uploaded_by=request.user
        )

        serializer = BookListSerializer(book)

        return Response(serializer.data)

class BookDeleteView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, book_id):

        book = get_object_or_404(
            Book,
            id=book_id,
            uploaded_by=request.user
        )

        profile = request.user.profile

        storage_to_remove = book.file_size_mb

        if book.file:
            book.file.delete(save=False)

        book.delete()

        profile.books_uploaded = max(
            0,
            profile.books_uploaded - 1
        )

        profile.storage_used_mb = max(
            0,
            profile.storage_used_mb - storage_to_remove
        )

        profile.save()

        return Response(
            {
                "message": "Book deleted successfully"
            }
        )