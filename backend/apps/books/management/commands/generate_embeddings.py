from django.core.management.base import BaseCommand

from apps.books.models import (
    Chunk,
    ChunkEmbedding
)

from apps.books.services.embedding_processor import (
    create_embedding
)


class Command(BaseCommand):

    help = "Generate embeddings"

    def handle(self, *args, **kwargs):

        chunks = Chunk.objects.all()

        created = 0

        for chunk in chunks:

            if hasattr(
                chunk,
                "embedding"
            ):
                continue

            create_embedding(chunk)

            created += 1

            self.stdout.write(
                f"Embedded chunk {chunk.id}"
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Created {created} embeddings"
            )
        )