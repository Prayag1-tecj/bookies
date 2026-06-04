from django.contrib import admin
from .models import (Book, Document, Chunk, ChunkEmbedding)

admin.site.register(Book)
admin.site.register(Document)
admin.site.register(Chunk)
admin.site.register(ChunkEmbedding)
