import os
import random
import smtplib
import threading

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
    print(f"\n[SECURITY DISPATCH] Dispatched OTP Code: {otp} for {receiver_email}")

    if not EMAIL or not PASSWORD:
        print("[NOTICE] EMAIL_ADDRESS or EMAIL_PASSWORD empty. Email delivery skipped.")
        return

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

    # 1. Try TLS Port 587 first (Standard for cloud hosting environments like Render)
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587, timeout=6)
        server.starttls()
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, receiver_email, message.as_string())
        server.quit()
        print(f"[SUCCESS] Verification Email Sent Successfully via TLS 587 to {receiver_email}")
        return True
    except Exception as tls_err:
        print(f"[TLS 587 Notice]: {tls_err}. Retrying via SSL Port 465...")

    # 2. Try SSL Port 465 fallback
    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=6)
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, receiver_email, message.as_string())
        server.quit()
        print(f"[SUCCESS] Verification Email Sent Successfully via SSL 465 to {receiver_email}")
        return True
    except Exception as ssl_err:
        print(f"[SSL 465 Error]: {ssl_err}")
        return False


def send_verification_email(receiver_email: str, otp: str):
    """
    Dispatches OTP verification email asynchronously in a non-blocking background thread.
    Returns immediately so HTTP requests complete instantly without timeout.
    """
    t = threading.Thread(target=_send_email_task, args=(receiver_email, otp), daemon=True)
    t.start()
    return True