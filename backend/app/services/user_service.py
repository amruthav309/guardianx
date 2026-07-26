import re
from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.history import History
from app.schemas.user import UserCreate
from app.utils.security import hash_password, verify_password
from app.services.email_service import (
    generate_otp,
    send_verification_email
)




def validate_password_strength(password: str):
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long.")
    if not re.search(r"[A-Z]", password):
        raise ValueError("Password must contain at least one capital letter.")
    if not re.search(r"[a-z]", password):
        raise ValueError("Password must contain at least one lowercase letter.")
    if not re.search(r"\d", password):
        raise ValueError("Password must contain at least one number.")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise ValueError("Password must contain at least one special character.")








# ==========================================
# Register User
# ==========================================

def create_user(
    db: Session,
    user: UserCreate
):
    validate_password_strength(user.password)
    clean_email = user.email.strip().lower()
    clean_username = user.username.strip()

    existing_email = (
        db.query(User)
        .filter(func.lower(User.email) == clean_email)
        .first()
    )

    if existing_email:
        raise Exception(
            "Email already registered."
        )

    existing_username = (
        db.query(User)
        .filter(func.lower(User.username) == clean_username.lower())
        .first()
    )

    if existing_username:
        raise Exception(
            "Username already exists."
        )

    otp = generate_otp()

    new_user = User(
        name=user.name.strip(),
        username=clean_username,
        email=clean_email,
        password=hash_password(
            user.password
        ),
        email_verified=False,
        verification_code=otp,
        account_status="Active",
        login_count=0,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    try:
        send_verification_email(
        new_user.email,
        otp
    )
    except Exception as e:
       print("Email Error:", e)
       print(f"[EMAIL SIMULATION] OTP for {new_user.email}: {otp}")

    return new_user


# ==========================================
# Login
# ==========================================

def login_user(
    db: Session,
    email: str,
    password: str
):
    clean_email = email.strip().lower()

    user = (
        db.query(User)
        .filter(func.lower(User.email) == clean_email)
        .first()
    )

    if user is None:
        return None

    if not verify_password(
        password,
        user.password
    ):
        return None

    if not user.email_verified:
        raise Exception(
            "Please verify your email first."
        )

    from app.utils.timezone import get_ist_now
    user.last_login = get_ist_now()

    user.login_count += 1

    db.commit()

    db.refresh(user)

    return user


# ==========================================
# Verify Email
# ==========================================

def verify_email(
    db: Session,
    email: str,
    otp: str
):
    clean_email = email.strip().lower()

    user = (
        db.query(User)
        .filter(func.lower(User.email) == clean_email)
        .first()
    )

    if user is None:
        raise Exception(
            "User not found."
        )

    if user.verification_code != otp:
        raise Exception(
            "Invalid OTP."
        )

    user.email_verified = True
    user.verification_code = None

    db.commit()
    db.refresh(user)

    return user


# ==========================================
# Resend OTP
# ==========================================

def resend_otp(
    db: Session,
    email: str
):
    clean_email = email.strip().lower()

    user = (
        db.query(User)
        .filter(func.lower(User.email) == clean_email)
        .first()
    )

    if user is None:
        raise Exception(
            "User not found."
        )

    otp = generate_otp()

    user.verification_code = otp

    db.commit()

    try:
        send_verification_email(
        user.email,
        otp
    )
    except Exception as e:
        print("Email Error:", e)
        print(f"[EMAIL SIMULATION] OTP for {user.email}: {otp}")

    return otp

# ==========================================
# Profile
# ==========================================

def get_profile(
    db: Session,
    user_id: int
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise Exception(
            "User not found."
        )

    return user

# ==========================================
# Change Password
# ==========================================

def change_password(
    db: Session,
    email: str,
    new_password: str,
    current_password: str = None,
):
    validate_password_strength(new_password)
    clean_email = email.strip().lower()

    user = (
        db.query(User)
        .filter(func.lower(User.email) == clean_email)
        .first()
    )

    if user is None:
        return None

    # If current_password is provided, verify it first (for logged-in change password option)
    if current_password is not None:
        from app.utils.security import verify_password
        if not verify_password(current_password, user.password):
            raise Exception("Incorrect current password.")

    user.password = hash_password(new_password)

    db.commit()
    db.refresh(user)

    return user

# ==========================================
# Send Forgot Password OTP
# ==========================================

def send_forgot_password_otp(
    db: Session,
    email: str,
):
    clean_email = email.strip().lower()

    user = (
        db.query(User)
        .filter(func.lower(User.email) == clean_email)
        .first()
    )

    if user is None:
        raise Exception("User not found.")

    otp = generate_otp()

    user.verification_code = otp

    db.commit()

    try:
        send_verification_email(
            user.email,
            otp
        )
    except Exception as e:
        print("Email Error:", e)
        print(f"[EMAIL SIMULATION] OTP for {user.email}: {otp}")

    return True
# ==========================================
# Verify Forgot Password OTP
# ==========================================

def verify_forgot_password_otp(
    db: Session,
    email: str,
    otp: str,
):
    clean_email = email.strip().lower()

    user = (
        db.query(User)
        .filter(func.lower(User.email) == clean_email)
        .first()
    )

    if user is None:
        raise Exception("User not found.")

    if user.verification_code != otp:
        raise Exception("Invalid OTP.")

    user.verification_code = None

    db.commit()

    return True

# ==========================================
# Update Profile
# ==========================================

def update_profile(
    db: Session,
    user_id: int,
    name: str,
    username: str,
    profile_pic: str = None,
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        return None

    if name is not None:
        user.name = name
    if username is not None:
        user.username = username
    if profile_pic is not None:
        user.profile_pic = profile_pic

    db.commit()
    db.refresh(user)

    return user

def delete_user(db: Session, user_id: int):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        return None

    # Delete user's scan history first
    db.query(History).filter(
        History.user_id == user_id
    ).delete()

    # Delete the user
    db.delete(user)

    db.commit()

    return True