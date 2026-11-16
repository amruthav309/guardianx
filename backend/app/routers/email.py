from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.history_service import save_history
from app.utils.advisor import generate_advice
from app.services.security_detector import scan_email as detect_email

router = APIRouter()


@router.post("/scan")
def scan_email(
    data: dict,
    db: Session = Depends(get_db)
):
    email = data.get("email", "")
    user_id = data.get("user_id")

    # Limit pasted email
    if len(email) > 3000:
        return {
            "status": "Error",
            "confidence": 0,
            "matched_words": [],
            "message": "Email is too large to paste. Please upload an email file (.eml, .msg, or .txt)."
        }

    print("\n===== EMAIL RECEIVED =====")
    print("Email received for security scanning.")

    result = detect_email(email)

    print("Detection Result:", result)
    print("==========================\n")

    # Save scan history
    if user_id:
        save_history(
            db=db,
            user_id=user_id,
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
