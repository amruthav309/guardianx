from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.history_service import save_history
from app.utils.advisor import generate_advice
from app.services.security_detector import scan_url as detect_url

router = APIRouter()


@router.post("/scan")
def scan_url(
    data: dict,
    db: Session = Depends(get_db)
):
    url = data.get("url", "")
    user_id = data.get("user_id")

    if not url:
        return {
            "status": "Error",
            "confidence": 0,
            "matched_words": [],
            "message": "URL cannot be empty."
        }

    print("\n===== URL RECEIVED =====")
    print(url)

    result = detect_url(url)

    print("Detection Result:", result)
    print("=========================\n")

    if user_id:
        save_history(
            db=db,
            user_id=user_id,
            scan_type="URL",
            filename=url,
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