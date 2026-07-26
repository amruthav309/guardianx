import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.routers import user
from app.routers import email
from app.routers import url
from app.routers import sms
from app.routers import password
from app.routers import upload
from app.routers import history
from app.routers import analytics
from app.routers import report
from app.routers import admin

from sqlalchemy import text
from app.database.database import engine, Base

from app.models.user import User
from app.models.history import History
from app.models.audit_log import AuditLog


Base.metadata.create_all(bind=engine)

# Database Migrations - Dynamically check and add security_level column if not present
try:
    with engine.connect() as conn:
        dialect = engine.dialect.name
        col_exists = False

        if "sqlite" in dialect:
            res = conn.execute(text("PRAGMA table_info(users)")).fetchall()
            cols = [r[1] for r in res] if res else []
            col_exists = "security_level" in cols
        elif "mysql" in dialect:
            res = conn.execute(text("SHOW COLUMNS FROM users LIKE 'security_level'")).fetchone()
            col_exists = bool(res)
        elif "postgres" in dialect:
            res = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='security_level'")).fetchone()
            col_exists = bool(res)

        if not col_exists:
            conn.execute(text("ALTER TABLE users ADD COLUMN security_level VARCHAR(50) DEFAULT 'Standard'"))
            conn.commit()
            print("Successfully migrated database: added security_level column to users table.")
except Exception as e:
    print(f"Database migration skipped/failed: {e}")

app = FastAPI(
    title="GuardianX API",
    version="1.0.0",
    description="AI Powered Cyber Security Platform"
)

# Ensure uploads directory exists
Path("uploads").mkdir(exist_ok=True)

# React build directory
STATIC_DIR = Path(__file__).parent / "static"

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount(
    "/assets",
    StaticFiles(directory=STATIC_DIR / "assets"),
    name="assets"
)



# CORS — allow local dev, production frontend, and all Vercel preview deployments
FRONTEND_URL = os.getenv("FRONTEND_URL", "").strip()

allow_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

if FRONTEND_URL:
    allow_origins.append(FRONTEND_URL)
    if FRONTEND_URL.startswith("https://"):
        allow_origins.append(FRONTEND_URL.replace("https://", "https://www."))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
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

# Admin Portal
app.include_router(
    admin.router,
    prefix="/admin",
    tags=["Admin Portal"]
)



# Serve the built React app
@app.get("/", include_in_schema=False)
async def serve_home():
    return FileResponse(STATIC_DIR / "index.html")


# Serve React routes (dashboard, login, analytics, etc.)
@app.get("/{full_path:path}", include_in_schema=False)
async def serve_react(full_path: str):

    # Let FastAPI handle API endpoints normally
    if full_path.startswith((
        "users",
        "email",
        "url",
        "sms",
        "password",
        "upload",
        "history",
        "analytics",
        "report",
        "admin",
        "uploads",
        "assets",
        "docs",
        "redoc",
        "openapi.json",
        "favicon.svg",
        "icons.svg"
    )):
        # Let mounted routes (/assets, /uploads, APIs) handle these requests.
       from fastapi import HTTPException
       raise HTTPException(status_code=404)

    # React Router fallback
    return FileResponse(STATIC_DIR / "index.html")