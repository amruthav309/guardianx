import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# Support direct DATABASE_URL (for production/Render PostgreSQL) or build from parts
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

# Render uses "postgres://" but SQLAlchemy needs "postgresql://"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

if not DATABASE_URL:
    # Try to build MySQL URL from individual env vars (local dev)
    db_user = os.getenv("DB_USER", "")
    db_password = os.getenv("DB_PASSWORD", "")
    db_host = os.getenv("DB_HOST", "")
    db_port = os.getenv("DB_PORT", "")
    db_name = os.getenv("DB_NAME", "")

    if all([db_user, db_password, db_host, db_port, db_name]):
        DATABASE_URL = (
            f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
        )
    else:
        # Fallback to SQLite (for Render free tier when DB not yet linked)
        DATABASE_URL = "sqlite:///./guardianx.db"
        print("[WARNING] No DATABASE_URL or MySQL env vars found — using SQLite fallback.")

# For SQLite, need to adjust connect_args
is_sqlite = DATABASE_URL.startswith("sqlite")

engine = create_engine(
    DATABASE_URL,
    echo=os.getenv("DEBUG", "False").lower() == "true",
    connect_args={"check_same_thread": False} if is_sqlite else {}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()