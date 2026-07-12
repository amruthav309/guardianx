from datetime import datetime

from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.models.user import User
from app.schemas.user import UserCreate
from app.services.email_service import (
    generate_otp,
    send_verification_email
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# ==========================================
# Register User
# ==========================================

def create_user(
    db: Session,
    user: UserCreate
):

    existing_email = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_email:
        raise Exception(
            "Email already registered."
        )

    existing_username = (
        db.query(User)
        .filter(User.username == user.username)
        .first()
    )

    if existing_username:
        raise Exception(
            "Username already exists."
        )

    otp = generate_otp()

    new_user = User(
        name=user.name,
        username=user.username,
        email=user.email,
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

    send_verification_email(
        new_user.email,
        otp
    )

    return new_user


# ==========================================
# Login
# ==========================================

def login_user(
    db: Session,
    email: str,
    password: str
):

    user = (
        db.query(User)
        .filter(User.email == email)
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

    user.last_login = datetime.now()

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

    user = (
        db.query(User)
        .filter(User.email == email)
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

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        raise Exception(
            "User not found."
        )

    otp = generate_otp()

    user.verification_code = otp

    db.commit()

    send_verification_email(
        user.email,
        otp
    )

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
):

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        return None


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

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        raise Exception("User not found.")

    otp = generate_otp()

    user.verification_code = otp

    db.commit()

    send_verification_email(
        user.email,
        otp
    )

    return True

# ==========================================
# Verify Forgot Password OTP
# ==========================================

def verify_forgot_password_otp(
    db: Session,
    email: str,
    otp: str,
):

    user = (
        db.query(User)
        .filter(User.email == email)
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
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        return None

    user.name = name
    user.username = username

    db.commit()
    db.refresh(user)

    return user