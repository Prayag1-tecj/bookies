from django.db import models
from django.contrib.auth.models import User


class Book(models.Model):

    STATUS_CHOICES = [
        ("UPLOADED", "Uploaded"),
        ("PROCESSING", "Processing"),
        ("READY", "Ready"),
        ("FAILED", "Failed"),
    ]

    FILE_TYPES = [
        ("PDF", "PDF"),
        ("EPUB", "EPUB"),
        ("TXT", "TXT"),
        ("DOCX", "DOCX"),
    ]

    title = models.CharField(
        max_length=255
    )

    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="books"
    )

    file = models.FileField(
        upload_to="books/"
    )

    file_type = models.CharField(
        max_length=10,
        choices=FILE_TYPES
    )

    file_size_mb = models.FloatField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="UPLOADED"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title