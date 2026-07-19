import hashlib
import base64
from passlib.context import CryptContext


# One central password hashing configuration
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def _preprocess_password(password: str) -> str:
    """
    Hash the password with SHA-256 and encode in Base64 to ensure it is always
    a fixed length (44 bytes), preventing bcrypt's 72-byte truncation limit.
    """
    sha256_hash = hashlib.sha256(password.encode("utf-8")).digest()
    return base64.b64encode(sha256_hash).decode("utf-8")


def hash_password(password: str) -> str:
    """
    Hash a password securely using bcrypt after pre-processing it.
    """
    if not isinstance(password, str):
        raise ValueError("Password must be a string.")

    preprocessed = _preprocess_password(password)
    return pwd_context.hash(preprocessed)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    """
    Verify a password against its stored bcrypt hash, supporting both pre-processed
    and original formats (for backward compatibility).
    """
    if not plain_password or not hashed_password:
        return False

    # 1. Try verifying with pre-processed password (new format)
    try:
        preprocessed = _preprocess_password(plain_password)
        if pwd_context.verify(preprocessed, hashed_password):
            return True
    except Exception:
        pass

    # 2. Fall back to verification without pre-processing (old format)
    try:
        if pwd_context.verify(plain_password, hashed_password):
            return True
    except Exception:
        pass

    return False