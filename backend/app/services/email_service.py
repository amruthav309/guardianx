import os
import random
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

# Verified Gmail credentials for GuardianX OTP Delivery
EMAIL = os.getenv("EMAIL_ADDRESS", "amruthav309@gmail.com").strip()
PASSWORD = os.getenv("EMAIL_PASSWORD", "bmsabxvjuxyirqzk").strip().replace(" ", "")


def generate_otp():
    return str(random.randint(100000, 999999))


def _send_email_task(receiver_email: str, otp: str):
    print(f"\n[SECURITY DISPATCH] Starting OTP Delivery: {otp} -> {receiver_email}")

    if not EMAIL or not PASSWORD:
        print("[NOTICE] EMAIL_ADDRESS or EMAIL_PASSWORD empty. Email delivery skipped.")
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

    # 1. Try SSL Port 465 FIRST
    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=12)
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, receiver_email, message.as_string())
        server.quit()
        print(f"[SUCCESS] Verification Email Sent Successfully via SSL 465 to {receiver_email}")
        return True
    except Exception as ssl_err:
        print(f"[SSL 465 Notice]: {ssl_err}. Retrying via TLS Port 587...")

    # 2. Fallback to TLS Port 587
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587, timeout=12)
        server.starttls()
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, receiver_email, message.as_string())
        server.quit()
        print(f"[SUCCESS] Verification Email Sent Successfully via TLS 587 to {receiver_email}")
        return True
    except Exception as tls_err:
        print(f"[SMTP Error]: ({tls_err})")
        return False


def send_verification_email(receiver_email: str, otp: str):
    """
    Dispatches OTP verification email synchronously to guarantee delivery.
    """
    return _send_email_task(receiver_email, otp)