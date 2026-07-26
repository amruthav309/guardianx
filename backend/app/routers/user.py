import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.user import (
    UserCreate,
    UserLogin,
    ChangePassword,
    UpdateProfile,
    VerifyEmail,
    ResendOTP,
    ForgotPasswordRequest,
    VerifyForgotPasswordOTP,
)
   
from app.services.user_service import (
    create_user,
    login_user,
    change_password,
    update_profile,
    verify_email,
    resend_otp,
    get_profile,
    send_forgot_password_otp,
    verify_forgot_password_otp,
    delete_user,
)
   

router = APIRouter()


# ==========================================
# Register
# ==========================================

@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    try:

        new_user = create_user(
            db,
            user
        )

        return {
            "message": "Registration Successful. Please verify your email.",
            "id": new_user.id,
            "name": new_user.name,
            "username": new_user.username,
            "email": new_user.email,
            "email_verified": new_user.email_verified,
            "otp": new_user.verification_code,
            "profile_pic": new_user.profile_pic,
        }

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# ==========================================
# Login
# ==========================================

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    try:

        db_user = login_user(
            db,
            user.email,
            user.password
        )

        if db_user is None:

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password."
            )

        return {

            "message": "Login Successful",

            "id": db_user.id,

            "name": db_user.name,

            "username": db_user.username,

            "email": db_user.email,

            "email_verified": db_user.email_verified,

            "login_count": db_user.login_count,

            "last_login": db_user.last_login,

            "account_status": db_user.account_status,

            "profile_pic": db_user.profile_pic,

            "security_level": db_user.security_level,

        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    


# ==========================================
# Change Password
# ==========================================

@router.post("/change-password")
def update_password(
    data: ChangePassword,
    db: Session = Depends(get_db),
):
    try:
        result = change_password(
            db,
            data.email,
            data.new_password,
            current_password=data.current_password,
        )

        if result is None:
            return {
                "message": "User not found"
            }

        return {
            "message": "Password updated successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

# ==========================================
# Forgot Password - Send OTP
# ==========================================

@router.post("/forgot-password/send-otp")
def forgot_password_send_otp(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):

    send_forgot_password_otp(
        db,
        data.email,
    )

    return {
        "message": "OTP sent successfully."
    }

# ==========================================
# Forgot Password - Verify OTP
# ==========================================

@router.post("/forgot-password/verify-otp")
def forgot_password_verify_otp(
    data: VerifyForgotPasswordOTP,
    db: Session = Depends(get_db),
):

    verify_forgot_password_otp(
        db,
        data.email,
        data.otp,
    )

    return {
        "message": "OTP verified successfully."
    }

# ==========================================
# Update Profile
# ==========================================

@router.put("/update-profile/{user_id}")
def update_user_profile(
    user_id: int,
    data: UpdateProfile,
    db: Session = Depends(get_db),
):

    user = update_profile(
        db,
        user_id,
        data.name,
        data.username,
        data.profile_pic,
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    return {
        "message": "Profile updated successfully.",
        "user": {
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "email": user.email,
            "profile_pic": user.profile_pic,
        }
    }

# ==========================================
# Verify Email
# ==========================================

@router.post("/verify-email")
def verify(
    data: VerifyEmail,
    db: Session = Depends(get_db)
):

    try:

        user = verify_email(
            db,
            data.email,
            data.otp
        )

        return {

            "message": "Email verified successfully.",

            "email_verified": user.email_verified

        }

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# ==========================================
# Resend OTP
# ==========================================

@router.post("/resend-otp")
def resend(
    data: ResendOTP,
    db: Session = Depends(get_db)
):

    try:

        otp = resend_otp(
            db,
            data.email
        )

        return {
            "message": "OTP Sent Successfully.",
            "otp": otp,
        }

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# ==========================================
# User Profile
# ==========================================

@router.get("/profile/{user_id}")
def profile(
    user_id: int,
    db: Session = Depends(get_db)
):

    try:

        user = get_profile(
            db,
            user_id
        )

        return {

            "id": user.id,

            "name": user.name,

            "username": user.username,

            "email": user.email,

            "email_verified": user.email_verified,

            "login_count": user.login_count,

            "last_login": user.last_login,

            "account_status": user.account_status,

            "profile_pic": user.profile_pic,

            "created_at": user.created_at,

        }

    except Exception as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )
    
@router.delete("/delete/{user_id}")
def delete_account(
    user_id: int,
    db: Session = Depends(get_db)
):
    result = delete_user(db, user_id)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    return {
        "message": "Account deleted successfully."
    }

# ==========================================
# Upload Avatar
# ==========================================

UPLOAD_DIR = "uploads"

@router.post("/upload-avatar/{user_id}")
async def upload_avatar(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    ext = os.path.splitext(file.filename)[1] if file.filename else ".png"
    filename = f"avatar_{user_id}_{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        content = await file.read()
        f.write(content)

    avatar_url = f"http://127.0.0.1:8000/uploads/{filename}"

    user = update_profile(db, user_id, None, None, avatar_url)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return {
        "message": "Avatar uploaded successfully.",
        "avatar_url": avatar_url,
    }


# ==========================================
# Update Security Level
# ==========================================

@router.put("/security-level/{user_id}")
def update_user_security_level(
    user_id: int,
    data: dict,
    db: Session = Depends(get_db)
):
    from app.models.user import User
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    level = data.get("security_level", "Standard")
    user.security_level = level
    db.commit()
    db.refresh(user)

    return {
        "message": "Security level updated successfully.",
        "security_level": user.security_level
    }

from app.models.user import User

@router.delete("/admin/delete-user/{email}")
def delete_user_by_email(
    email: str,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.email == email.lower())
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully."
    }