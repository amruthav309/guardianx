import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers import user
from app.routers import email
from app.routers import url
from app.routers import sms
from app.routers import password
from app.routers import upload
from app.routers import history
from app.routers import analytics
from app.routers import report

from app.database.database import engine, Base

from app.models.user import User
from app.models.history import History


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GuardianX API",
    version="1.0.0",
    description="AI Powered Cyber Security Platform"
)

# Ensure uploads directory exists
Path("uploads").mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS — allow local dev and production frontend URL
FRONTEND_URL = os.getenv("FRONTEND_URL", "")

allow_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

if FRONTEND_URL:
    allow_origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication
app.include_router(
    user.router,
    prefix="/users",
    tags=["Users"]
)

# Email Scanner
app.include_router(
    email.router,
    prefix="/email",
    tags=["Email Scanner"]
)

# URL Scanner
app.include_router(
    url.router,
    prefix="/url",
    tags=["URL Scanner"]
)

# SMS Scanner
app.include_router(
    sms.router,
    prefix="/sms",
    tags=["SMS Scanner"]
)

# Password Checker
app.include_router(
    password.router,
    prefix="/password",
    tags=["Password Checker"]
)

# File Upload & OCR
app.include_router(
    upload.router,
    prefix="/upload",
    tags=["Upload"]
)

# Scan History
app.include_router(
    history.router
)

# Dashboard Analytics
app.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["Analytics"]
)

# PDF Report
app.include_router(
    report.router,
    prefix="/report",
    tags=["PDF Report"]
)

@app.get("/")
def home():
    return {
        "application": "GuardianX",
        "version": "1.0",
        "status": "Running",
        "message": "GuardianX Backend is running successfully 🚀"
    }