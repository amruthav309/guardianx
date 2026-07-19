from pydantic import BaseModel, EmailStr


# ==========================
# Register
# ==========================

class UserCreate(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str


# ==========================
# Login
# ==========================

class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ==========================
# Change Password
# ==========================

class ChangePassword(BaseModel):
    email: EmailStr
    new_password: str


# ==========================
# Update Profile
# ==========================

class UpdateProfile(BaseModel):
    name: str
    username: str
    profile_pic: str = None


# ==========================
# Verify Email
# ==========================

class VerifyEmail(BaseModel):
    email: EmailStr
    otp: str


# ==========================
# Resend OTP
# ==========================

class ResendOTP(BaseModel):
    email: EmailStr

# ==========================
# Forgot Password - Send OTP
# ==========================

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


# ==========================
# Verify Forgot Password OTP
# ==========================

class VerifyForgotPasswordOTP(BaseModel):
    email: EmailStr
    otp: str