from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime
)

from sqlalchemy.sql import func

from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    username = Column(
        String(50),
        unique=True,
        nullable=True
    )

    email = Column(
        String(120),
        unique=True,
        nullable=False,
        index=True
    )

    password = Column(
        String(255),
        nullable=False
    )

    email_verified = Column(
        Boolean,
        default=False
    )

    verification_code = Column(
        String(10),
        nullable=True
    )

    login_count = Column(
        Integer,
        default=0
    )

    last_login = Column(
        DateTime,
        nullable=True
    )

    account_status = Column(
        String(20),
        default="Active"
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )