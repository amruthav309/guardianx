import os
import random
import requests
from dotenv import load_dotenv

load_dotenv()

BREVO_API_KEY = os.getenv("BREVO_API_KEY", "").strip()

# IMPORTANT:
# This must be an email address that you have added and verified
# as a sender inside Brevo.
BREVO_SENDER_EMAIL = os.getenv(
    "BREVO_SENDER_EMAIL",
    "amruthav309@gmail.com"
).strip()

BREVO_SENDER_NAME = "GuardianX Security"


def generate_otp():
    return str(random.randint(100000, 999999))


def send_verification_email(receiver_email: str, otp: str):
    """
    Send GuardianX OTP through Brevo Transactional Email API.
    """

    print(
        f"\n[SECURITY DISPATCH] "
        f"Sending OTP {otp} -> {receiver_email} via Brevo API..."
    )

    if not BREVO_API_KEY:
        print("[ERROR] BREVO_API_KEY is missing.")
        return False

    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
    }

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <body>
        <h2>GuardianX AI Cyber Security Platform</h2>

        <p>Your GuardianX email verification code is:</p>

        <h1>{otp}</h1>

        <p>This code is valid for <b>5 minutes</b>.</p>

        <p>
            Enter this code on GuardianX to verify your email
            and activate your account.
        </p>

        <p>
            If you did not request this code, you can safely ignore
            this email.
        </p>

        <p>
            Regards,<br>
            <b>GuardianX Security Team</b>
        </p>
    </body>
    </html>
    """

    payload = {
        "sender": {
            "name": BREVO_SENDER_NAME,
            "email": BREVO_SENDER_EMAIL
        },
        "to": [
            {
                "email": receiver_email
            }
        ],
        "subject": f"GuardianX Verification Code: {otp}",
        "htmlContent": html_body
    }

    try:
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=20
        )

        print(f"[BREVO STATUS] {response.status_code}")
        print(f"[BREVO RESPONSE] {response.text}")

        if 200 <= response.status_code < 300:
            print(
                f"[SUCCESS] Verification email sent to "
                f"{receiver_email}"
            )
            return True

        print("[ERROR] Brevo rejected the email.")
        return False

    except Exception as error:
        print(f"[ERROR] Brevo API failed: {error}")
        return False