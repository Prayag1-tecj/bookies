from apps.books.models import (
    ChunkEmbedding
)

from .embedding_service import (
    generate_embedding
)


def create_embedding(chunk):

    vector = generate_embedding(
        chunk.content
    )

    ChunkEmbedding.objects.create(
        chunk=chunk,
        embedding=vector
    )