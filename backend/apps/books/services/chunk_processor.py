from apps.books.models import Chunk

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

        Chunk.objects.create(
            document=document,
            chunk_index=index,
            content=chunk_text,
            word_count=len(
                chunk_text.split()
            )
        )