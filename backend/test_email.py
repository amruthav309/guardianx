from app.services.email_service import (
    generate_otp,
    send_verification_email
)

otp = generate_otp()

print("Generated OTP:", otp)

send_verification_email(
    "amruthav309@gmail.com",
    otp
)