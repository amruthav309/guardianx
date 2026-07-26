import os
import random
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

# Pure Direct Gmail SMTP Credentials
EMAIL = os.getenv("EMAIL_ADDRESS", "amruthav309@gmail.com").strip()
PASSWORD = os.getenv("EMAIL_PASSWORD", "bmsabxvjuxyirqzk").strip().replace(" ", "")


def generate_otp():
    return str(random.randint(100000, 999999))


def send_verification_email(receiver_email: str, otp: str):
    """
    Sends a 6-digit verification OTP code directly to the receiver's inbox
    using Gmail SMTP (amruthav309@gmail.com).
    """
    print(f"\n[SECURITY DISPATCH] Sending OTP {otp} -> {receiver_email} via Gmail SMTP...")

    if not EMAIL or not PASSWORD:
        print("[ERROR] EMAIL_ADDRESS or EMAIL_PASSWORD empty. Dispatch cancelled.")
        return False

    subject = f"GuardianX Verification Code: {otp}"

    body = f"""Hello,

Welcome to GuardianX AI Cyber Security Platform!

Your 6-Digit Email Verification Code is:

  {otp}

This code is valid for 5 minutes. Please enter this code on the verification screen to activate your account.

If you didn't request this verification code, please ignore this email.

Best regards,
GuardianX Security Team
"""

    message = MIMEMultipart()
    message["From"] = f"GuardianX Security <{EMAIL}>"
    message["To"] = receiver_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    # 1. Try Gmail SSL Port 465 Primary
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15) as server:
            server.login(EMAIL, PASSWORD)
            server.sendmail(EMAIL, receiver_email, message.as_string())
        print(f"[SUCCESS] Verification Email Sent via Gmail SSL (Port 465) to {receiver_email}")
        return True
    except Exception as ssl_err:
        print(f"[SSL Port 465 Notice]: {ssl_err}. Retrying via Gmail TLS (Port 587)...")

    # 2. Fallback to Gmail TLS Port 587
    try:
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=15) as server:
            server.starttls()
            server.login(EMAIL, PASSWORD)
            server.sendmail(EMAIL, receiver_email, message.as_string())
        print(f"[SUCCESS] Verification Email Sent via Gmail TLS (Port 587) to {receiver_email}")
        return True
    except Exception as tls_err:
        print(f"[ERROR] Gmail SMTP Dispatch Failed: {tls_err}")
        return False