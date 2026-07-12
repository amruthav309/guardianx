import os
import random
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

EMAIL = os.getenv("EMAIL_ADDRESS")
PASSWORD = os.getenv("EMAIL_PASSWORD")


def generate_otp():
    return str(random.randint(100000, 999999))


def send_verification_email(receiver_email: str, otp: str):

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

        server = smtplib.SMTP("smtp.gmail.com", 587)

        server.starttls()

        server.login(EMAIL, PASSWORD)

        server.sendmail(
            EMAIL,
            receiver_email,
            message.as_string()
        )

        server.quit()

        print("Verification Email Sent Successfully")

    except Exception as e:

        print("Email Error:", e)