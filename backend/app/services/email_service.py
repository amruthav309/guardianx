import os
import random
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS", "").strip()
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "").strip().replace(" ", "")


def generate_otp():
    return str(random.randint(100000, 999999))


def send_verification_email(receiver_email: str, otp: str):
    """
    Sends GuardianX verification OTP using Gmail SMTP.
    """

    print(
        f"\n[SECURITY DISPATCH] "
        f"Sending OTP {otp} -> {receiver_email} via Gmail SMTP..."
    )

    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        print("[ERROR] EMAIL_ADDRESS or EMAIL_PASSWORD is missing.")
        return False

    subject = f"GuardianX Verification Code: {otp}"

    body = f"""
Hello,

Welcome to GuardianX AI Cyber Security Platform!

Your 6-digit email verification code is:

{otp}

This code is valid for 5 minutes.

Enter this code on the GuardianX verification screen
to activate your account.

If you didn't request this verification code,
please ignore this email.

Best regards,
GuardianX Security Team
"""

    message = MIMEMultipart()
    message["From"] = f"GuardianX Security <{EMAIL_ADDRESS}>"
    message["To"] = receiver_email
    message["Subject"] = subject

    message.attach(MIMEText(body, "plain"))

    # Gmail SMTP
    try:
        with smtplib.SMTP_SSL(
            "smtp.gmail.com",
            465,
            timeout=20
        ) as server:

            server.login(
                EMAIL_ADDRESS,
                EMAIL_PASSWORD
            )

            server.sendmail(
                EMAIL_ADDRESS,
                receiver_email,
                message.as_string()
            )

        print(
            f"[SUCCESS] Verification email sent to {receiver_email}"
        )

        return True

    except Exception as error:
        print(
            f"[ERROR] Gmail SMTP email failed: {error}"
        )

        return False