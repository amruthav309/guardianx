from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.history_service import save_history
from app.utils.advisor import generate_advice

router = APIRouter()


@router.post("/scan")
def scan_email(
    data: dict,
    db: Session = Depends(get_db)
):

    email = data.get("email", "")

    # Limit pasted email to 3000 characters
    if len(email) > 3000:
        return {
            "status": "Error",
            "confidence": 0,
            "matched_words": [],
            "message": "Email is too large to paste. Please upload an email file (.eml, .msg, or .txt)."
        }

    print("\n===== EMAIL RECEIVED =====")
    print(email)
    print("==========================\n")

    email = email.lower()

    phishing_words = [
        "verify",
        "urgent",
        "bank",
        "password",
        "click",
        "login",
        "account",
        "winner",
        "prize",
        "limited",
    ]

    found = []

    for word in phishing_words:
        if word in email:
            found.append(word)

    print("Matched words:", found)

    if len(found) >= 2:
        result = {
            "status": "Phishing",
            "confidence": 95,
            "matched_words": found,
        }
    else:
        result = {
            "status": "Safe",
            "confidence": 92,
            "matched_words": found,
        }

    # Save scan history
    save_history(
    db=db,
    user_id=data["user_id"],
    scan_type="Email",
    filename="Manual Input",
    status=result["status"],
    confidence=result["confidence"],
)

    # AI Security Advisor
    advice = generate_advice(
        result["status"],
        result["matched_words"],
    )

    return {
        **result,
        "advisor": advice,
    }