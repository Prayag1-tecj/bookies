from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import (
    IsAuthenticated
)
from apps.books.models import Book
from apps.books.services.retrieval_service import (
    retrieve_relevant_chunks
)

from .services.gemini_service import (
    generate_answer
)
from .models import (
    ChatSession,
    ChatMessage
)


def parse_required_int(value, field_name):
    if value in (None, ""):
        return None, Response(
            {
                "error": f"{field_name} is required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        return int(value), None
    except (TypeError, ValueError):
        return None, Response(
            {
                "error": f"{field_name} must be a valid integer"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

class AskQuestionView(APIView):


    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        profile = request.user.profile


        if profile.questions_today >= 50:
                return Response(
                    {
                        "error":
                        "Daily question limit reached"
                    },
                    status=403
                )

        session_id, error_response = parse_required_int(
            request.data.get("session_id"),
            "session_id"
        )

        if error_response:
            return error_response

        question = request.data.get("question")

        if not isinstance(question, str) or not question.strip():
            return Response(
                {
                    "error": "question is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        question = question.strip()

        session = (
            ChatSession.objects
            .select_related("book")
            .filter(
                id=session_id,
                user=request.user
            )
            .first()
        )

        if not session:
            return Response(
                {
                    "error": "Chat session not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            chunks = retrieve_relevant_chunks(
                question,
                session.book.id
            )

            context = "\n\n".join(
                chunk.content
                for chunk in chunks
            )

            answer = generate_answer(
                question,
                context
            )
        except Exception:
            return Response(
                {
                    "error": "Failed to generate an answer. Please try again."
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        if session.title == "New Chat":

            session.title = question[:100]

            session.save()

        ChatMessage.objects.create(
            session=session,
            role="USER",
            content=question
        )

        ChatMessage.objects.create(
            session=session,
            role="AI",
            content=answer
        )

        request.user.profile.questions_today += 1
        request.user.profile.save()

        return Response(
            {
                "answer": answer
            }
        )

class ChatHistoryView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request,
        session_id
    ):

        session = (
            ChatSession.objects
            .filter(
                id=session_id,
                user=request.user
            )
            .first()
        )

        if not session:
            return Response(
                {
                    "error": "Chat session not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        messages = (
            session.messages.all()
        )

        return Response(
            [
                {
                    "role": msg.role,
                    "content": msg.content,
                    "created_at": msg.created_at
                }
                for msg in messages
            ]
        )

class CreateChatSessionView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        book_id, error_response = parse_required_int(
            request.data.get("book_id"),
            "book_id"
        )

        if error_response:
            return error_response

        title = request.data.get(
            "title",
            "New Chat"
        )

        if not isinstance(title, str) or not title.strip():
            title = "New Chat"
        else:
            title = title.strip()[:255]

        book = (
            Book.objects
            .filter(
                id=book_id,
                uploaded_by=request.user
            )
            .first()
        )

        if not book:
            return Response(
                {
                    "error": "Book not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        session = ChatSession.objects.create(
            user=request.user,
            book=book,
            title=title
        )

        return Response({
            "id": session.id,
            "title": session.title,
            "book_id": book.id
        })

class SessionListView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        sessions = (
            ChatSession.objects
            .filter(user=request.user)
            .order_by("-created_at")
        )

        return Response(
            [
                {
                    "id": session.id,
                    "title": session.title,
                    "book_id": session.book.id,
                    "created_at": session.created_at
                }
                for session in sessions
            ]
        )

class DeleteSessionView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def delete(
        self,
        request,
        session_id
    ):

        session = (
            ChatSession.objects
            .filter(
                id=session_id,
                user=request.user
            )
            .first()
        )

        if not session:
            return Response(
                {
                    "error": "Chat session not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        session.delete()

        return Response(
            {
                "message":
                "Session deleted successfully"
            }
        )
