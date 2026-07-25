from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True, index=True)
    email = Column(String(120), nullable=False, index=True)
    event_type = Column(String(20), nullable=False) # LOGIN, LOGOUT, FAILED_LOGIN
    ip_address = Column(String(50), nullable=True, default="127.0.0.1")
    user_agent = Column(String(255), nullable=True, default="Browser/Web")
    status = Column(String(20), nullable=False, default="SUCCESS")
    timestamp = Column(DateTime, server_default=func.now(), index=True)
