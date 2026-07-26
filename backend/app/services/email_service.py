import os
import random
import smtplib
import threading

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

EMAIL = os.getenv("EMAIL_ADDRESS")
PASSWORD = os.getenv("EMAIL_PASSWORD")


def generate_otp():
    return str(random.randint(100000, 999999))


def _send_email_async(receiver_email: str, otp: str):
    print(f"\n🔒 [EMAIL SECURITY OTP] Sent OTP Code: {otp} to {receiver_email}\n")

    if not EMAIL or not PASSWORD:
        print("[NOTICE] EMAIL_ADDRESS or EMAIL_PASSWORD not set. Email delivery skipped; check OTP in logs above.")
        return

    subject = "GuardianX - Email Verification"

    body = f"""
Hello,

Welcome to GuardianX!

Your Email Verification Code is:

{otp}

This code is valid for 5 minutes.

If you didn't create a GuardianX account, please ignore this email.

Regards,
GuardianX Security Team
"""

    message = MIMEMultipart()
    message["From"] = EMAIL
    message["To"] = receiver_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587, timeout=4)
        server.starttls()
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, receiver_email, message.as_string())
        server.quit()
        print(f"Verification Email Sent Successfully to {receiver_email}")
    except Exception as e:
        print(f"Email Dispatch Notice ({e}): OTP logged above for verification.")


def send_verification_email(receiver_email: str, otp: str):
    thread = threading.Thread(target=_send_email_async, args=(receiver_email, otp))
    thread.daemon = True
    thread.start()