from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

import shutil
import os

from PIL import Image
import pytesseract

from app.database.database import get_db
from app.services.history_service import save_history
from app.utils.file_reader import read_uploaded_file
from app.utils.advisor import generate_advice

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


@router.post("/file")
async def upload_file(
    user_id: int = None,
    db: Session = Depends(get_db),
    file: UploadFile = File(...)
):

    filepath = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    extension = os.path.splitext(
        file.filename
    )[1].lower()

    if extension in [
        ".png",
        ".jpg",
        ".jpeg"
    ]:

        try:
            image = Image.open(filepath)

            text = pytesseract.image_to_string(
                image
            )
        except Exception as ocr_err:
            print(f"OCR processing failed (Tesseract may not be installed): {ocr_err}")
            text = "[OCR Analysis Error: Tesseract-OCR is not installed or configured correctly on the server. Image text extraction skipped.]"

    else:

        text = read_uploaded_file(
            filepath
        )

    phishing_words = [
        "password",
        "verify",
        "bank",
        "login",
        "click",
        "urgent",
        "account",
        "winner",
        "gift",
        "free",
    ]

    matched = []

    content = text.lower()

    for word in phishing_words:

        if word in content:
            matched.append(word)

    if len(matched) >= 2:

        status = "Phishing"
        confidence = 95

    elif len(matched) == 1:

        status = "Suspicious"
        confidence = 75

    else:

        status = "Safe"
        confidence = 92

    if user_id:
        save_history(
            db=db,
            user_id=user_id,
            scan_type="File",
            filename=file.filename,
            status=status,
            confidence=confidence,
        )

    advisor = generate_advice(
        status,
        matched
    )

    return {
        "filename": file.filename,
        "content": text,
        "status": status,
        "confidence": confidence,
        "matched_words": matched,
        "advisor": advisor,
    }