from fastapi import APIRouter, Depends
import re
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.history_service import save_history

router = APIRouter()


@router.post("/check")
def check_password(
    data: dict,
    db: Session = Depends(get_db)
):

    password = data.get("password", "")
    user_id = data.get("user_id")

    score = 0

    suggestions = []

    if len(password) >= 8:
        score += 20
    else:
        suggestions.append("Use at least 8 characters.")

    if re.search(r"[A-Z]", password):
        score += 20
    else:
        suggestions.append("Add uppercase letters.")

    if re.search(r"[a-z]", password):
        score += 20
    else:
        suggestions.append("Add lowercase letters.")

    if re.search(r"\d", password):
        score += 20
    else:
        suggestions.append("Add numbers.")

    if re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        score += 20
    else:
        suggestions.append("Add special characters.")

    if score <= 40:
        strength = "Weak"

    elif score <= 80:
        strength = "Medium"

    else:
        strength = "Strong"

    if user_id:
        try:
            save_history(
                db=db,
                user_id=user_id,
                scan_type="Password",
                filename="Manual Input",
                status=strength,
                confidence=score,
            )
        except Exception as e:
            print(f"Error logging password check to db: {e}")

    return {
        "strength": strength,
        "score": score,
        "suggestions": suggestions
    }