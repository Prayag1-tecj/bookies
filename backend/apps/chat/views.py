from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import (
    IsAuthenticated
)

from apps.books.services.retrieval_service import (
    retrieve_relevant_chunks
)

from .services.gemini_service import (
    generate_answer
)


class AskQuestionView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        book_id = request.data.get(
            "book_id"
        )

        question = request.data.get(
            "question"
        )

        chunks = retrieve_relevant_chunks(
            question,
            book_id
        )

        context = "\n\n".join(
            chunk.content
            for chunk in chunks
        )

        answer = generate_answer(
            question,
            context
        )

        request.user.profile.questions_today += 1
        request.user.profile.save()

        return Response(
            {
                "answer": answer
            }
        )
