import os
import hashlib
import base64

import bcrypt


def _preprocess_password(password: str) -> str:
    """
    Hash the password with SHA-256 and encode in Base64 to ensure it is always
    a fixed length (44 bytes), safely under bcrypt's 72-byte limit.
    """
    sha256_hash = hashlib.sha256(password.encode("utf-8")).digest()
    return base64.b64encode(sha256_hash).decode("utf-8")


def hash_password(password: str) -> str:
    """
    Hash a password securely using bcrypt after SHA-256 pre-processing.
    The pre-processing guarantees the input is always 44 bytes (< 72 limit).
    """
    if not isinstance(password, str):
        raise ValueError("Password must be a string.")

    preprocessed = _preprocess_password(password)
    salt = bcrypt.gensalt(rounds=12)
    hashed_bytes = bcrypt.hashpw(preprocessed.encode("utf-8"), salt)
    return hashed_bytes.decode("utf-8")


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

    # 1. Try verifying with pre-processed password (current format)
    try:
        preprocessed = _preprocess_password(plain_password)
        if bcrypt.checkpw(preprocessed.encode("utf-8"), hashed_password.encode("utf-8")):
            return True
    except Exception:
        pass

    # 2. Fall back to verification without pre-processing (old format)
    try:
        if bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8")):
            return True
    except Exception:
        pass

    return False