from sqlalchemy import text
from app.database.database import engine


def save_scan(
    scan_type: str,
    filename: str,
    status: str,
    confidence: int,
    matched_words: list
):

    with engine.begin() as connection:

        connection.execute(
            text("""
                INSERT INTO scan_history
                (
                    scan_type,
                    filename,
                    status,
                    confidence,
                    matched_words
                )

                VALUES
                (
                    :scan_type,
                    :filename,
                    :status,
                    :confidence,
                    :matched_words
                )
            """),
            {
                "scan_type": scan_type,
                "filename": filename,
                "status": status,
                "confidence": confidence,
                "matched_words": ", ".join(matched_words)
            }
        )