from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.history_service import save_history
from app.utils.advisor import generate_advice

router = APIRouter()


@router.post("/scan")
def scan_url(
    data: dict,
    db: Session = Depends(get_db)
):

    url = data.get("url", "").lower()

    suspicious_keywords = [
        "login",
        "verify",
        "secure",
        "bank",
        "update",
        "account",
        "password",
        "signin",
        "confirm",
        "free",
        "gift",
        "winner",
        "bonus",
        "paypal",
        "bitcoin",
    ]

    found = []

    for word in suspicious_keywords:
        if word in url:
            found.append(word)

    if len(found) >= 2:

        result = {
            "status": "Phishing",
            "confidence": 96,
            "matched_words": found
        }

    else:

        result = {
            "status": "Safe",
            "confidence": 93,
            "matched_words": found
        }

    # Save to History
    save_history(
    db=db,
    user_id=data["user_id"],
    scan_type="URL",
    filename=data.get("url", "Manual URL"),
    status=result["status"],
    confidence=result["confidence"],
)

    # AI Security Advisor
    advisor = generate_advice(
        result["status"],
        result["matched_words"]
    )

    return {
        **result,
        "advisor": advisor
    }