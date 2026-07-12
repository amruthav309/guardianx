from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
)

from datetime import datetime

from app.database.database import Base


class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)

    # Link each history record to a user
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    scan_type = Column(
        String(50),
        nullable=False,
    )

    filename = Column(
        String(255),
        nullable=False,
    )

    status = Column(
        String(50),
        nullable=False,
    )

    confidence = Column(
        Float,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )