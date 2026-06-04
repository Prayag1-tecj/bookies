from pypdf import PdfReader
from docx import Document as DocxDocument

from ebooklib import epub
from bs4 import BeautifulSoup


def extract_pdf_text(file_path):

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text


def extract_txt_text(file_path):

    with open(
        file_path,
        "r",
        encoding="utf-8",
        errors="ignore"
    ) as file:

        return file.read()


def extract_docx_text(file_path):

    document = DocxDocument(file_path)

    return "\n".join(
        paragraph.text
        for paragraph in document.paragraphs
    )


def extract_epub_text(file_path):

    book = epub.read_epub(file_path)

    text = ""

    for item in book.get_items():

        if item.get_type() == 9:

            soup = BeautifulSoup(
                item.get_content(),
                "html.parser"
            )

            text += soup.get_text()

    return text