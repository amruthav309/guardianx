import os
import random
import resend
from dotenv import load_dotenv

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "").strip()

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


def generate_otp():
    return str(random.randint(100000, 999999))


def send_verification_email(receiver_email: str, otp: str):
    """
    Sends GuardianX verification OTP using the Resend HTTPS API.
    """

    print(
        f"\n[SECURITY DISPATCH] "
        f"Sending OTP {otp} -> {receiver_email} via Resend..."
    )

    if not RESEND_API_KEY:
        print("[ERROR] RESEND_API_KEY is missing.")
        return False

    subject = f"GuardianX Verification Code: {otp}"

    html_body = f"""
    <html>
        <body>
            <h2>GuardianX AI Cyber Security Platform</h2>

            <p>Your 6-digit email verification code is:</p>

            <h1>{otp}</h1>

            <p>This code is valid for 5 minutes.</p>

            <p>
                Enter this code on the GuardianX verification screen
                to activate your account.
            </p>

            <p>
                If you didn't request this verification code,
                please ignore this email.
            </p>

            <p>
                Best regards,<br>
                GuardianX Security Team
            </p>
        </body>
    </html>
    """

    try:
        params = {
            "from": "GuardianX <onboarding@resend.dev>",
            "to": [receiver_email],
            "subject": subject,
            "html": html_body,
        }

        response = resend.Emails.send(params)

        print(
            f"[SUCCESS] Verification email sent to {receiver_email}"
        )
        print(f"[RESEND RESPONSE] {response}")

        return True

    except Exception as error:
        print(f"[ERROR] Resend email failed: {error}")
        return False