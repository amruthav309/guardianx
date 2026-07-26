import os
import random
import smtplib
import threading

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

EMAIL = os.getenv("EMAIL_ADDRESS", "amruthav309@gmail.com").strip()
PASSWORD = os.getenv("EMAIL_PASSWORD", "gkxveebvyxwkpzgx").strip().replace(" ", "")


def generate_otp():
    return str(random.randint(100000, 999999))


def _send_email_async(receiver_email: str, otp: str):
    print(f"\n[SECURITY DISPATCH] Preparing OTP Code: {otp} for {receiver_email}")

    if not EMAIL or not PASSWORD:
        print("[NOTICE] EMAIL_ADDRESS or EMAIL_PASSWORD empty. Email delivery skipped.")
        return

    subject = "GuardianX - Email Verification Code"

    body = f"""Hello,

Welcome to GuardianX AI Cyber Security Platform!

Your 6-Digit Email Verification Code is:

{otp}

This code is valid for 5 minutes. Please enter this code on the verification screen to activate your account.

If you didn't create a GuardianX account, please ignore this email.

Best regards,
GuardianX Security Team
"""

    message = MIMEMultipart()
    message["From"] = f"GuardianX Security <{EMAIL}>"
    message["To"] = receiver_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    # Try SMTP_SSL on Port 465 first, fallback to TLS Port 587
    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10)
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, receiver_email, message.as_string())
        server.quit()
        print(f"[SUCCESS] Verification Email Sent Successfully via SSL to {receiver_email}")
        return
    except Exception as ssl_err:
        print(f"[SSL Dispatch Notice]: {ssl_err}. Retrying via TLS Port 587...")

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587, timeout=10)
        server.starttls()
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, receiver_email, message.as_string())
        server.quit()
        print(f"[SUCCESS] Verification Email Sent Successfully via TLS to {receiver_email}")
    except Exception as tls_err:
        print(f"[SMTP Authentication Error]: Google rejected email credentials ({tls_err}). Please generate a new Gmail App Password at myaccount.google.com/apppasswords.")


def send_verification_email(receiver_email: str, otp: str):
    thread = threading.Thread(target=_send_email_async, args=(receiver_email, otp))
    thread.daemon = True
    thread.start()