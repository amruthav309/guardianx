from pathlib import Path
import pdfplumber
from docx import Document


def read_uploaded_file(file_path: str) -> str:
    extension = Path(file_path).suffix.lower()

    if extension == ".txt":
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()

    elif extension == ".eml":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
            return file.read()

    elif extension == ".pdf":
        text = ""

        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

        return text

    elif extension == ".docx":
        doc = Document(file_path)

        text = ""

        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"

        return text

    return ""