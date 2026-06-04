from django.contrib import admin
from .models import (Book, Document, Chunk)

admin.site.register(Book)
admin.site.register(Document)
admin.site.register(Chunk)
