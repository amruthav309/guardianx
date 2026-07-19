from fastapi import APIRouter
from sqlalchemy import text
from datetime import datetime
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
                WHERE scan_type='Email'
                AND user_id=:user_id
            """),
            {"user_id": user_id},
        ).scalar()

        urls = connection.execute(
            text("""
                SELECT COUNT(*)
                FROM history
                WHERE scan_type='URL'
                AND user_id=:user_id
            """),
            {"user_id": user_id},
        ).scalar()

        sms = connection.execute(
            text("""
                SELECT COUNT(*)
                FROM history
                WHERE scan_type='SMS'
                AND user_id=:user_id
            """),
            {"user_id": user_id},
        ).scalar()

        threats = connection.execute(
            text("""
                SELECT COUNT(*)
                FROM history
                WHERE status='Phishing'
                AND user_id=:user_id
            """),
            {"user_id": user_id},
        ).scalar()

        weekly_rows = connection.execute(
            text("""
                SELECT created_at
                FROM history
                WHERE user_id=:user_id
                ORDER BY created_at
            """),
            {"user_id": user_id},
        ).fetchall()

        days = {
            "Mon": 0,
            "Tue": 0,
            "Wed": 0,
            "Thu": 0,
            "Fri": 0,
            "Sat": 0,
            "Sun": 0,
        }

        for row in weekly_rows:

            created = row.created_at

            if created is None:
                continue

            if isinstance(created, str):

                try:
                    created = datetime.fromisoformat(created)
                except:
                    try:
                        created = datetime.strptime(
                            created,
                            "%Y-%m-%d %H:%M:%S"
                        )
                    except:
                        continue

            day = created.strftime("%a")

            if day in days:
                days[day] += 1

        weekly_trend = [
            {
                "day": day,
                "scans": count
            }
            for day, count in days.items()
        ]

        total_scans = total or 0

        phishing_rate = (
            (threats / total_scans) * 100
            if total_scans > 0
            else 0
        )

        security_score = max(
            0,
            round(100 - phishing_rate)
        )

        if phishing_rate >= 50:
            risk_level = "HIGH"
        elif phishing_rate >= 20:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        if risk_level == "HIGH":
            firewall_status = "UNDER ATTACK"
        elif risk_level == "MEDIUM":
            firewall_status = "MONITORING"
        else:
            firewall_status = "PROTECTED"

        return {
            "total_scans": total_scans,
            "emails": emails or 0,
            "urls": urls or 0,
            "sms": sms or 0,
            "threats": threats or 0,
            "security_score": security_score,
            "risk_level": risk_level,
            "firewall_status": firewall_status,
            "scanner_status": "READY",
            "database_status": "ONLINE",
            "session_status": "SECURE",
            "last_sync": datetime.now().strftime("%I:%M:%S %p"),
            "weekly_trend": weekly_trend,
        }