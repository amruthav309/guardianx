from fastapi import APIRouter
from sqlalchemy import text
from datetime import datetime
from app.database.database import engine
from app.utils.timezone import get_ist_str

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
                SELECT created_at, status
                FROM history
                WHERE user_id=:user_id
                ORDER BY created_at
            """),
            {"user_id": user_id},
        ).fetchall()

        days = {
            "Mon": {"scans": 0, "threats": 0},
            "Tue": {"scans": 0, "threats": 0},
            "Wed": {"scans": 0, "threats": 0},
            "Thu": {"scans": 0, "threats": 0},
            "Fri": {"scans": 0, "threats": 0},
            "Sat": {"scans": 0, "threats": 0},
            "Sun": {"scans": 0, "threats": 0},
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
                days[day]["scans"] += 1
                if row.status == "Phishing":
                    days[day]["threats"] += 1

        weekly_trend = [
            {
                "day": day,
                "scans": info["scans"],
                "threats": info["threats"]
            }
            for day, info in days.items()
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
            "last_sync": get_ist_str(),
            "weekly_trend": weekly_trend,
        }