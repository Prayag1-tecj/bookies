from django.urls import path

from .views import (
    AskQuestionView,
    ChatHistoryView,
    CreateChatSessionView,
    SessionListView,
    DeleteSessionView
)

urlpatterns = [
    path(
        "ask/",
        AskQuestionView.as_view()
    ),

    path(
        "history/<int:session_id>/",
        ChatHistoryView.as_view()
    ),

    path(
        "sessions/create/",
        CreateChatSessionView.as_view()
    ),

    path(
        "sessions/",
        SessionListView.as_view()
    ),

    path(
        "sessions/<int:session_id>/",
        DeleteSessionView.as_view()
    ),
]
