from fastapi import APIRouter, Depends, HTTPException
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

    result = change_password(
        db,
        data.email,
        data.new_password,
    )

    if result is None:

        return {
            "message": "User not found"
        }

    return {
        "message": "Password updated successfully"
    }

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

        resend_otp(
            db,
            data.email
        )

        return {

            "message": "OTP Sent Successfully."

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

            "created_at": user.created_at,

        }

    except Exception as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )