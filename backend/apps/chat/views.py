from rest_framework.views import APIView
from rest_framework.response import Response
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

        session_id = request.data.get("session_id")
        question = request.data.get("question")

        session = ChatSession.objects.get(
            id=session_id,
            user=request.user
        )

        ChatMessage.objects.create(
            session=session,
            role="USER",
            content=question
        )

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

        session = ChatSession.objects.get(
            id=session_id,
            user=request.user
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

        book_id = request.data.get("book_id")
        title = request.data.get("title")

        book = Book.objects.get(
            id=book_id
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