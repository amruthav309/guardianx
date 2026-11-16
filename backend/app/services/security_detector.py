import re
import difflib
import ipaddress
from urllib.parse import urlparse

# -----------------------------
# Trusted Domains
# -----------------------------

TRUSTED_DOMAINS = {
    "github.com",
    "google.com",
    "gmail.com",
    "microsoft.com",
    "amazon.com",
    "paypal.com",
    "linkedin.com",
    "apple.com",
    "openai.com",
    "facebook.com",
    "instagram.com",
    "youtube.com",
    "x.com",
    "twitter.com",
    "cloudflare.com",
    "sbi.co.in",
    "hdfcbank.com",
    "icicibank.com",
    "axisbank.com",
    "flipkart.com",
}

# -----------------------------
# Suspicious TLDs
# -----------------------------

BAD_TLDS = {
    ".xyz",
    ".top",
    ".tk",
    ".ru",
    ".click",
    ".loan",
    ".work",
    ".buzz",
    ".monster",
    ".live",
}

# -----------------------------
# Credential Theft Words
# -----------------------------

CREDENTIAL_WORDS = [
    "password",
    "otp",
    "pin",
    "cvv",
    "credit card",
    "debit card",
    "wallet",
    "seed phrase",
    "recovery code",
    "security code",
]

# -----------------------------
# Social Engineering Words
# -----------------------------

SOCIAL_WORDS = [
    "urgent",
    "immediately",
    "act now",
    "limited time",
    "verify",
    "confirm",
    "suspended",
    "your account",
    "refund",
    "invoice",
    "parcel",
    "delivery",
    "winner",
    "lottery",
    "claim prize",
    "gift",
]
def extract_urls(text):

    pattern = r'https?://[^\s<>"\']+'

    return re.findall(pattern, text)

def is_trusted_domain(domain):
    domain = domain.lower().strip().rstrip(".")

    return any(
        domain == trusted or domain.endswith("." + trusted)
        for trusted in TRUSTED_DOMAINS
    )

def bad_tld(domain):

    return any(domain.endswith(tld) for tld in BAD_TLDS)

def is_ip(domain):

    try:
        ipaddress.ip_address(domain)
        return True
    except Exception:
        return False


def spoofed_brand(domain):

    labels = domain.lower().split(".")

    for trusted in TRUSTED_DOMAINS:

        trusted_labels = trusted.split(".")

        brand = trusted_labels[0]

        for label in labels:

            if label == brand:
                continue

            similarity = difflib.SequenceMatcher(
                None,
                label,
                brand
            ).ratio()

            if similarity >= 0.80 and len(label) >= 4:
                return True, trusted

    return False, None
def analyze_url(url):

    score = 0
    reasons = []

    url = url.strip()

    if not url:
        return 0, ["Empty URL"]

    # Handle URLs without an explicit scheme
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", url):
        url = "https://" + url

    try:
        parsed = urlparse(url)
        domain = (parsed.hostname or "").lower().rstrip(".")

    except ValueError:
        return 100, ["Invalid URL structure"]

    if not domain:
        return 100, ["Missing or invalid hostname"]

    # HTTP is less secure than HTTPS
    if parsed.scheme.lower() != "https":
        score += 15
        reasons.append("Does not use HTTPS")

    # Misleading username or password in URL
    if parsed.username is not None or parsed.password is not None:
        score += 40
        reasons.append("URL contains misleading user information")

    # IP address instead of a normal domain
    if is_ip(domain):
        score += 40
        reasons.append("URL uses an IP address")

    # Punycode / internationalized domain
    if "xn--" in domain:
        score += 30
        reasons.append("Internationalized or potentially deceptive domain")

    # Check trusted domain correctly
    trusted = is_trusted_domain(domain)

    if not trusted:
        score += 10
        reasons.append("Domain is not in the trusted-domain list")

    # Suspicious extensions
    if bad_tld(domain):
        score += 25
        reasons.append("Suspicious domain extension")

    # Brand impersonation
    fake, original = spoofed_brand(domain)

    if fake:
        score += 40
        reasons.append(
            f"Possible impersonation of {original}"
        )

    # URL length
    if len(url) > 120:
        score += 10
        reasons.append("Unusually long URL")

    # Common URL shorteners
    shorteners = {
        "bit.ly",
        "tinyurl.com",
        "t.co",
        "is.gd",
        "cutt.ly",
    }

    if domain in shorteners:
        score += 25
        reasons.append("URL uses a link-shortening service")

    # Suspicious URL characters
    if "%" in parsed.path:
        score += 5
        reasons.append("URL contains encoded characters")

    return score, reasons
# -----------------------------
# Credential Theft Detection
# -----------------------------

def detect_credentials(text):

    score = 0
    reasons = []

    text = text.lower()

    for word in CREDENTIAL_WORDS:

        pattern = rf"\b{re.escape(word)}\b"
        if re.search(pattern, text):
            score += 20
            reasons.append(f"Credential request: {word}")

    return score, reasons

# -----------------------------
# Social Engineering Detection
# -----------------------------

def detect_social_engineering(text):

    score = 0
    reasons = []

    text = text.lower()

    for word in SOCIAL_WORDS:

        pattern = rf"\b{re.escape(word)}\b"
        if re.search(pattern, text):
            score += 10
            reasons.append(f"Social engineering: {word}")

    return score, reasons

# -----------------------------
# Dangerous Attachments
# -----------------------------

def detect_dangerous_files(text):

    score = 0
    reasons = []

    dangerous = [
        ".exe",
        ".zip",
        ".rar",
        ".js",
        ".vbs",
        ".scr",
        ".bat",
        ".cmd",
        ".msi",
    ]

    for ext in dangerous:

        # Match file extensions attached to a file name (e.g. file.exe, script.js)
        # Using word boundaries and a dot
        pattern = rf"\b[\w-]+\.{re.escape(ext[1:])}\b"
        if re.search(pattern, text.lower()):
            score += 25
            reasons.append(f"Dangerous attachment ({ext})")

    return score, reasons

# -----------------------------
# Analyze URLs inside Text
# -----------------------------

def analyze_urls_in_text(text):

    total_score = 0

    reasons = []

    urls = extract_urls(text)

    for url in urls:

        score, r = analyze_url(url)

        total_score += score

        reasons.extend(r)

    return total_score, reasons

# -----------------------------
# Threat Category
# -----------------------------

def detect_category(text):

    text = text.lower()

    if "lottery" in text or "winner" in text:
        return "Lottery Scam"

    if "password" in text or "otp" in text:
        return "Credential Theft"

    if "parcel" in text or "delivery" in text:
        return "Delivery Scam"

    if "invoice" in text:
        return "Invoice Scam"

    if "bank" in text:
        return "Financial Scam"

    return "General Suspicious Activity"

# -----------------------------
# Threat Level
# -----------------------------

def threat_level(score):

    if score < 25:
        return "Low"

    if score < 50:
        return "Medium"

    if score < 75:
        return "High"

    return "Critical"

# -----------------------------
# Confidence
# -----------------------------

def confidence(score):

    if score < 30:
        return 96

    if score < 60:
        return 88

    if score < 80:
        return 94

    return 99

# -----------------------------
# Main Text Analyzer
# -----------------------------

def analyze_text(text):

    score = 0

    reasons = []

    c_score, c_reason = detect_credentials(text)
    score += c_score
    reasons.extend(c_reason)

    s_score, s_reason = detect_social_engineering(text)
    score += s_score
    reasons.extend(s_reason)

    u_score, u_reason = analyze_urls_in_text(text)
    score += u_score
    reasons.extend(u_reason)

    f_score, f_reason = detect_dangerous_files(text)
    score += f_score
    reasons.extend(f_reason)

    score = max(score, 0)

    if score >= 70:
        status = "Phishing"

    elif score >= 35:
        status = "Suspicious"

    else:
        status = "Safe"

    return {

        "status": status,

        "score": score,

        "confidence": confidence(score),

        "threat_level": threat_level(score),

        "category": detect_category(text),

        "matched_words": reasons,

    }

    # ----------------------------------------
# EMAIL SCANNER
# ----------------------------------------

def scan_email(email_text):

    result = analyze_text(email_text)

    return {
        "status": result["status"],
        "score": result["score"],
        "confidence": result["confidence"],
        "threat_level": result["threat_level"],
        "category": result["category"],
        "matched_words": result["matched_words"],
    }

# ----------------------------------------
# SMS SCANNER
# ----------------------------------------

def scan_sms(sms_text):

    result = analyze_text(sms_text)

    return {
        "status": result["status"],
        "score": result["score"],
        "confidence": result["confidence"],
        "threat_level": result["threat_level"],
        "category": result["category"],
        "matched_words": result["matched_words"],
    }

# ----------------------------------------
# URL SCANNER
# ----------------------------------------

def scan_url(url):

    score, reasons = analyze_url(url)

    score = max(score, 0)

    if score >= 70:
        status = "Phishing"

    elif score >= 35:
        status = "Suspicious"

    else:
        status = "Safe"

    return {

        "status": status,

        "score": score,

        "confidence": confidence(score),

        "threat_level": threat_level(score),

        "category": "Malicious URL",

        "matched_words": reasons,

    }
