from apps.books.models import Chunk
from .embedding_processor import create_embedding

from .chunker import (
    split_into_chunks
)


def create_chunks(document):

    chunks = split_into_chunks(
        document.raw_text
    )

    for index, chunk_text in enumerate(
        chunks
    ):

        chunk = Chunk.objects.create(
            document=document,
            chunk_index=index,
            content=chunk_text,
            word_count=len(chunk_text.split())
        )

        create_embedding(chunk)