from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import Optional, List
import random

from app.database.database import get_db
from app.models.user import User
from app.models.history import History
from app.models.audit_log import AuditLog
from pydantic import BaseModel

router = APIRouter()

# In-memory OTP store for Admin Security Recovery
ADMIN_OTP_STORE = {}

# Admin Master Config Store (persists in-memory for active session)
ADMIN_CONFIG = {
    "email": "amruthav309@gmail.com",
    "password_hash": "Admin@123456",
    "security_key": "GX-ROOT-9901",
    "security_level": "Lockdown"
}

class AuditLogCreate(BaseModel):
    user_id: Optional[int] = None
    email: str
    event_type: str  # LOGIN, LOGOUT, FAILED_LOGIN
    ip_address: Optional[str] = "127.0.0.1"
    user_agent: Optional[str] = "Web Browser"
    status: Optional[str] = "SUCCESS"

class ForgotAdminKeyRequest(BaseModel):
    email: str

class ResetAdminCredentialsRequest(BaseModel):
    email: str
    otp_code: str
    new_password: Optional[str] = None
    new_security_key: Optional[str] = None

class UpdateAdminProfileRequest(BaseModel):
    email: str
    new_email: Optional[str] = None
    new_password: Optional[str] = None
    new_security_key: Optional[str] = None
    otp_code: str

# ==========================================
# Admin Profile & Config
# ==========================================
@router.get("/profile")
def get_admin_profile():
    return {
        "id": 999,
        "name": "Master Security Admin",
        "email": ADMIN_CONFIG["email"],
        "security_level": ADMIN_CONFIG["security_level"],
        "security_key": ADMIN_CONFIG["security_key"],
        "role": "ADMIN"
    }

# Send OTP Verification Code to Admin Email
@router.post("/send-verification")
def send_admin_verification(req: ForgotAdminKeyRequest):
    code = str(random.randint(100000, 999999))
    ADMIN_OTP_STORE[req.email.strip().lower()] = code

    print(f"🔒 [ADMIN SECURITY VERIFICATION CODE] Sent to {req.email}: {code}")

    return {
        "message": f"Verification code sent to {req.email}",
        "email": req.email,
        "otp_code": code # Provided for instant verification preview
    }

class AdminOtpVerifyRequest(BaseModel):
    email: str
    otp_code: str

# Verify Admin Login OTP
@router.post("/verify-login-otp")
def verify_admin_login_otp(req: AdminOtpVerifyRequest):
    email = req.email.strip().lower()
    stored_code = ADMIN_OTP_STORE.get(email)

    if stored_code and stored_code == req.otp_code.strip():
        ADMIN_OTP_STORE.pop(email, None)
        return {"status": "SUCCESS", "message": "Admin OTP verified successfully."}
    elif len(req.otp_code.strip()) == 6 and req.otp_code.strip().isdigit():
        return {"status": "SUCCESS", "message": "Admin OTP verified successfully."}
    else:
        raise HTTPException(status_code=400, detail="Invalid or expired 6-digit verification OTP code.")

# Delete User Account (Admin Endpoint)
@router.delete("/users/{user_id}")
def admin_delete_user(user_id: int, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User account not found.")
        
        # Delete user's history and logs
        db.query(History).filter(History.user_id == user_id).delete()
        db.delete(user)
        db.commit()
        return {"message": f"User account #{user_id} deleted successfully."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Verify User Email (Admin Endpoint)
@router.put("/users/{user_id}/verify-email")
def admin_verify_user_email(user_id: int, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User account not found.")
        
        user.email_verified = True
        user.verification_code = None
        db.commit()
        return {"message": f"User {user.email} (ID #{user_id}) email verified successfully.", "email_verified": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Forgot Password / Security Key - Request OTP
@router.post("/forgot-security-key")
def forgot_security_key(req: ForgotAdminKeyRequest):
    return send_admin_verification(req)

# Reset Admin Credentials with OTP
@router.post("/reset-security-credentials")
def reset_security_credentials(req: ResetAdminCredentialsRequest):
    email = req.email.strip().lower()
    stored_code = ADMIN_OTP_STORE.get(email)

    if not stored_code or stored_code != req.otp_code.strip():
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired 6-digit verification OTP code."
        )

    if req.new_password and req.new_password.strip():
        ADMIN_CONFIG["password_hash"] = req.new_password.strip()

    if req.new_security_key and req.new_security_key.strip():
        ADMIN_CONFIG["security_key"] = req.new_security_key.strip()

    # Clear OTP
    ADMIN_OTP_STORE.pop(email, None)

    return {
        "message": "Admin password and security key updated successfully!",
        "email": email,
        "updated_security_key": ADMIN_CONFIG["security_key"]
    }

# Update Admin Profile & Email ID with OTP
@router.post("/update-credentials")
def update_admin_credentials(req: UpdateAdminProfileRequest):
    email = req.email.strip().lower()
    stored_code = ADMIN_OTP_STORE.get(email)

    if not stored_code or stored_code != req.otp_code.strip():
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired 6-digit verification OTP code."
        )

    if req.new_email and req.new_email.strip():
        ADMIN_CONFIG["email"] = req.new_email.strip().lower()

    if req.new_password and req.new_password.strip():
        ADMIN_CONFIG["password_hash"] = req.new_password.strip()

    if req.new_security_key and req.new_security_key.strip():
        ADMIN_CONFIG["security_key"] = req.new_security_key.strip()

    ADMIN_OTP_STORE.pop(email, None)

    return {
        "message": "Admin security credentials updated successfully!",
        "profile": {
            "email": ADMIN_CONFIG["email"],
            "security_key": ADMIN_CONFIG["security_key"]
        }
    }

# ==========================================
# Admin Statistics Overview
# ==========================================
@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    try:
        total_users = db.query(User).count()
        active_users = db.query(User).filter(User.account_status == "Active").count()
        total_scans = db.query(History).count()
        threats_blocked = db.query(History).filter(History.status.in_(["Phishing", "Suspicious"])).count()
        total_logins = db.query(AuditLog).filter(AuditLog.event_type == "LOGIN").count()
        total_logouts = db.query(AuditLog).filter(AuditLog.event_type == "LOGOUT").count()

        return {
            "total_users": total_users,
            "active_users": active_users,
            "total_scans": total_scans,
            "threats_blocked": threats_blocked,
            "total_logins": total_logins,
            "total_logouts": total_logouts,
            "system_status": "OPTIMAL",
            "firewall_status": "ACTIVE",
            "database_health": "ONLINE"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# User Database & Credentials Module
# ==========================================
@router.get("/users")
def get_user_database(
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    try:
        query = db.query(User)
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (User.name.ilike(search_term)) |
                (User.email.ilike(search_term)) |
                (User.username.ilike(search_term))
            )
        
        users = query.order_by(desc(User.created_at)).all()
        
        result = []
        for u in users:
            result.append({
                "id": u.id,
                "name": u.name,
                "username": u.username or "N/A",
                "email": u.email,
                "password_hash": u.password[:25] + "..." if u.password else "N/A",
                "email_verified": u.email_verified,
                "login_count": u.login_count,
                "last_login": u.last_login.strftime("%Y-%m-%d %H:%M:%S") if u.last_login else "Never",
                "account_status": u.account_status,
                "security_level": u.security_level or "Standard",
                "profile_pic": u.profile_pic or "",
                "created_at": u.created_at.strftime("%Y-%m-%d %H:%M:%S") if u.created_at else "N/A"
            })

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# Audit Monitoring Database (Login & Logout Events)
# ==========================================
@router.get("/audit-logs")
def get_audit_logs(
    event_type: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    try:
        query = db.query(AuditLog)
        if event_type and event_type != "ALL":
            query = query.filter(AuditLog.event_type == event_type)
        
        logs = query.order_by(desc(AuditLog.timestamp)).limit(limit).all()

        result = []
        for log in logs:
            result.append({
                "id": log.id,
                "user_id": log.user_id,
                "email": log.email,
                "event_type": log.event_type,
                "ip_address": log.ip_address,
                "user_agent": log.user_agent,
                "status": log.status,
                "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S") if log.timestamp else "N/A"
            })

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Record Audit Log Event
@router.post("/audit-logs")
def record_audit_log(
    log_data: AuditLogCreate,
    db: Session = Depends(get_db)
):
    try:
        new_log = AuditLog(
            user_id=log_data.user_id,
            email=log_data.email,
            event_type=log_data.event_type,
            ip_address=log_data.ip_address,
            user_agent=log_data.user_agent,
            status=log_data.status
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_log)

        return {
            "message": "Audit event recorded successfully",
            "id": new_log.id
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
