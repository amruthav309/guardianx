from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.services.history_service import (
    save_history,
    get_history,
    clear_history,
    delete_history,
)

from app.schemas.history import HistoryCreate

router = APIRouter(
    prefix="/history",
    tags=["History"],
)


# ==========================================
# Add History
# ==========================================

@router.post("/")
def create_history(
    data: HistoryCreate,
    db: Session = Depends(get_db),
):

    return save_history(
    db,
    data.user_id,
    data.scan_type,
    data.filename,
    data.status,
    data.confidence,
)


# ==========================================
# Get History
# ==========================================

@router.get("/")
def read_history(
    user_id: int,
    db: Session = Depends(get_db),
):
    return get_history(
        db,
        user_id,
    )


# ==========================================
# Clear History
# ==========================================

@router.delete("/clear")
def clear_history_route(
    user_id: int,
    db: Session = Depends(get_db),
):
    clear_history(
        db,
        user_id,
    )

    return {
        "message": "History cleared successfully."
    }

@router.delete("/{history_id}")
def delete_history_route(
    history_id: int,
    user_id: int,
    db: Session = Depends(get_db),
):
    return delete_history(
        db,
        history_id,
        user_id,
    )