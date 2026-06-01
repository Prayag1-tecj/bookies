from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    PLAN_CHOICES = [
        ("FREE", "Free"),
        ("PREMIUM", "Premium"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    plan = models.CharField(
        max_length=20,
        choices=PLAN_CHOICES,
        default="FREE"
    )

    books_uploaded = models.IntegerField(default=0)

    questions_today = models.IntegerField(default=0)

    storage_used_mb = models.FloatField(default=0)

    last_reset_date = models.DateField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.user.username} Profile"


