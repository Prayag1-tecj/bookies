from django.utils import timezone

from apps.books.models import Document

from .extractors import (
    extract_pdf_text,
    extract_txt_text,
    extract_docx_text,
    extract_epub_text,
)


def process_book(book):

    document, _ = Document.objects.get_or_create(
        book=book
    )

    document.extraction_status = "PROCESSING"
    document.save()

    try:

        file_path = book.file.path

        if book.file_type == "PDF":
            text = extract_pdf_text(file_path)

        elif book.file_type == "TXT":
            text = extract_txt_text(file_path)

        elif book.file_type == "DOCX":
            text = extract_docx_text(file_path)

        elif book.file_type == "EPUB":
            text = extract_epub_text(file_path)

        else:
            raise Exception(
                "Unsupported file type"
            )

        document.raw_text = text

        document.word_count = len(
            text.split()
        )

        document.extraction_status = "COMPLETED"

        document.processed_at = timezone.now()

        document.save()

        book.status = "READY"
        book.save()

    except Exception:

        document.extraction_status = "FAILED"
        document.save()

        book.status = "FAILED"
        book.save()