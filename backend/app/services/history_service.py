from sqlalchemy.orm import Session
from app.models.history import History


def save_history(
    db: Session,
    user_id: int,
    scan_type: str,
    filename: str,
    status: str,
    confidence: float,
):
    history = History(
    user_id=user_id,
    scan_type=scan_type,
    filename=filename,
    status=status,
    confidence=confidence,
)

    db.add(history)
    db.commit()
    db.refresh(history)

    return history


def get_history(
    db: Session,
    user_id: int,
):
    return (
        db.query(History)
        .filter(History.user_id == user_id)
        .order_by(History.created_at.desc())
        .all()
    )


def clear_history(
    db: Session,
    user_id: int,
):
    db.query(History).filter(
        History.user_id == user_id
    ).delete()
    db.commit()

    return {"message": "History cleared successfully."}


def delete_history(
    db: Session,
    history_id: int,
    user_id: int,
):
    history = (
        db.query(History)
        .filter(
    History.id == history_id,
    History.user_id == user_id,
)
        .first()
    )

    if not history:
        return {"message": "History not found"}

    db.delete(history)
    db.commit()

    return {"message": "Deleted successfully"}