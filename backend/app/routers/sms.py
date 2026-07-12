from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.history_service import save_history
from app.utils.advisor import generate_advice

router = APIRouter()


@router.post("/scan")
def scan_sms(
    data: dict,
    db: Session = Depends(get_db)
):

    sms = data.get("sms", "").lower()

    suspicious_keywords = [
        "otp",
        "verify",
        "click",
        "urgent",
        "bank",
        "account",
        "winner",
        "free",
        "gift",
        "claim",
        "prize",
        "limited",
        "offer",
        "login",
        "password",
    ]

    found = []

    for word in suspicious_keywords:
        if word in sms:
            found.append(word)

    if len(found) >= 2:

        result = {
            "status": "Phishing",
            "confidence": 95,
            "matched_words": found
        }

    elif len(found) == 1:

        result = {
            "status": "Suspicious",
            "confidence": 75,
            "matched_words": found
        }

    else:

        result = {
            "status": "Safe",
            "confidence": 92,
            "matched_words": found
        }

    # Save to History
    save_history(
    db=db,
    user_id=data["user_id"],
    scan_type="SMS",
    filename="Manual SMS",
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