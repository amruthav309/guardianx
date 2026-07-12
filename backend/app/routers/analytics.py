from fastapi import APIRouter
from sqlalchemy import text
from app.database.database import engine

router = APIRouter()


@router.get("/")
def dashboard_analytics(user_id: int):

    with engine.connect() as connection:

        total = connection.execute(
            text("""
                SELECT COUNT(*)
                FROM history
                WHERE user_id = :user_id
            """),
            {"user_id": user_id},
        ).scalar()

        emails = connection.execute(
            text("""
                SELECT COUNT(*)
                FROM history
                WHERE scan_type = 'Email'
                AND user_id = :user_id
            """),
            {"user_id": user_id},
        ).scalar()

        urls = connection.execute(
            text("""
                SELECT COUNT(*)
                FROM history
                WHERE scan_type = 'URL'
                AND user_id = :user_id
            """),
            {"user_id": user_id},
        ).scalar()

        sms = connection.execute(
            text("""
                SELECT COUNT(*)
                FROM history
                WHERE scan_type = 'SMS'
                AND user_id = :user_id
            """),
            {"user_id": user_id},
        ).scalar()

        threats = connection.execute(
            text("""
                SELECT COUNT(*)
                FROM history
                WHERE status = 'Phishing'
                AND user_id = :user_id
            """),
            {"user_id": user_id},
        ).scalar()

        return {
            "total_scans": total,
            "emails": emails,
            "urls": urls,
            "sms": sms,
            "threats": threats,
        }