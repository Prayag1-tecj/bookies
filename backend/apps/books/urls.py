from django.urls import path

from .views import (
    BookUploadView,
)

from .views import (
    BookUploadView,
    BookListView,
    BookDetailView,
    BookDeleteView,
)

urlpatterns = [
    path(
        "upload/",
        BookUploadView.as_view()
    ),

    path(
        "",
        BookListView.as_view()
    ),

    path(
        "<int:book_id>/",
        BookDetailView.as_view()
    ),

    path(
        "<int:book_id>/delete/",
        BookDeleteView.as_view()
    ),
]