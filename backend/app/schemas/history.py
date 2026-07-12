from pydantic import BaseModel
from datetime import datetime


class HistoryCreate(BaseModel):
    user_id: int
    scan_type: str
    filename: str
    status: str
    confidence: float


class HistoryResponse(BaseModel):
    id: int
    user_id: int
    scan_type: str
    filename: str
    status: str
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True