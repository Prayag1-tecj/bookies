import numpy as np

from sklearn.metrics.pairwise import cosine_similarity

from apps.books.models import ChunkEmbedding

from .embedding_service import generate_embedding


def retrieve_relevant_chunks(
    question,
    book_id,
    top_k=5
):

    question_vector = generate_embedding(
        question
    )

    embeddings = (
        ChunkEmbedding.objects
        .select_related(
            "chunk",
            "chunk__document",
            "chunk__document__book"
        )
        .filter(
            chunk__document__book_id=book_id
        )
    )

    scores = []

    for item in embeddings:

        similarity = cosine_similarity(
            [question_vector],
            [item.embedding]
        )[0][0]

        scores.append(
            (
                similarity,
                item.chunk
            )
        )

    scores.sort(
        key=lambda x: x[0],
        reverse=True
    )

    return [
        chunk
        for _, chunk
        in scores[:top_k]
    ]