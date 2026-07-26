import os
import json
import random
import smtplib
import urllib.request

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

# Verified Email credentials for GuardianX OTP Delivery
EMAIL = os.getenv("EMAIL_ADDRESS", "amruthav309@gmail.com").strip()
PASSWORD = os.getenv("EMAIL_PASSWORD", "bmsabxvjuxyirqzk").strip().replace(" ", "")


def generate_otp():
    return str(random.randint(100000, 999999))


def _send_email_task(receiver_email: str, otp: str):
    print(f"\n[SECURITY DISPATCH] Starting OTP Delivery: {otp} -> {receiver_email}")

    # 1. Try Brevo HTTPS API if BREVO_API_KEY environment variable is configured
    brevo_key = os.getenv("BREVO_API_KEY", "").strip()
    if brevo_key:
        try:
            req_data = json.dumps({
                "sender": {"name": "GuardianX Security", "email": EMAIL},
                "to": [{"email": receiver_email}],
                "subject": f"GuardianX Verification Code: {otp}",
                "htmlContent": f"""
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #070709; color: #ffffff; border-radius: 10px;">
                    <h2 style="color: #06b6d4;">GUARDIANX SECURITY</h2>
                    <p>Welcome to GuardianX AI Cyber Security Platform!</p>
                    <p>Your 6-Digit Email Verification Code is:</p>
                    <div style="font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #10b981; padding: 10px 0;">{otp}</div>
                    <p style="color: #9ca3af; font-size: 12px;">This code is valid for 5 minutes. Enter this code on the verification screen to activate your account.</p>
                </div>
                """
            }).encode("utf-8")
            
            req = urllib.request.Request(
                "https://api.brevo.com/v3/smtp/email",
                data=req_data,
                headers={
                    "accept": "application/json",
                    "api-key": brevo_key,
                    "content-type": "application/json"
                },
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                print(f"[SUCCESS] Verification Email Sent via Brevo HTTP API to {receiver_email}")
                return True
        except Exception as brevo_err:
            print(f"[Brevo API Notice]: {brevo_err}. Falling back to Resend / SMTP...")

    # 2. Try Resend HTTPS API if RESEND_API_KEY environment variable is configured
    resend_key = os.getenv("RESEND_API_KEY", "").strip()
    if resend_key:
        try:
            req_data = json.dumps({
                "from": "GuardianX Security <onboarding@resend.dev>",
                "to": [receiver_email],
                "subject": f"GuardianX Verification Code: {otp}",
                "html": f"""
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #070709; color: #ffffff; border-radius: 10px;">
                    <h2 style="color: #06b6d4;">GUARDIANX SECURITY</h2>
                    <p>Welcome to GuardianX AI Cyber Security Platform!</p>
                    <p>Your 6-Digit Email Verification Code is:</p>
                    <div style="font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #10b981; padding: 10px 0;">{otp}</div>
                    <p style="color: #9ca3af; font-size: 12px;">This code is valid for 5 minutes. Enter this code on the verification screen to activate your account.</p>
                </div>
                """
            }).encode("utf-8")
            
            req = urllib.request.Request(
                "https://api.resend.com/emails",
                data=req_data,
                headers={
                    "Authorization": f"Bearer {resend_key}",
                    "Content-Type": "application/json"
                },
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                print(f"[SUCCESS] Verification Email Sent via Resend HTTP API to {receiver_email}")
                return True
        except Exception as resend_err:
            print(f"[Resend API Notice]: {resend_err}. Falling back to Gmail SMTP...")

    # 3. Standard Gmail SMTP Dispatch
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

    # Try SSL Port 465 FIRST
    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=12)
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, receiver_email, message.as_string())
        server.quit()
        print(f"[SUCCESS] Verification Email Sent Successfully via SSL 465 to {receiver_email}")
        return True
    except Exception as ssl_err:
        print(f"[SSL 465 Notice]: {ssl_err}. Retrying via TLS Port 587...")

    # Fallback to TLS Port 587
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