from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.history_service import save_history
from app.utils.advisor import generate_advice
from app.services.security_detector import scan_sms as detect_sms

router = APIRouter()


@router.post("/scan")
def scan_sms(
    data: dict,
    db: Session = Depends(get_db)
):
    sms = data.get("sms", "")
    user_id = data.get("user_id")

    if len(sms) > 3000:
        return {
            "status": "Error",
            "confidence": 0,
            "matched_words": [],
            "message": "SMS is too large."
        }

    print("\n===== SMS RECEIVED =====")
    print(sms)

    result = detect_sms(sms)

    print("Detection Result:", result)
    print("=========================\n")

    if user_id:
        save_history(
            db=db,
            user_id=user_id,
            scan_type="SMS",
            filename="Manual SMS",
            status=result["status"],
            confidence=result["confidence"],
        )

    advice = generate_advice(
        result["status"],
        result["matched_words"],
    )

    return {
        **result,
        "advisor": advice,
    }