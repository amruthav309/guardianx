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

    domain = domain.lower()

    return any(domain.endswith(d) for d in TRUSTED_DOMAINS)

def bad_tld(domain):

    return any(domain.endswith(tld) for tld in BAD_TLDS)

def is_ip(domain):

    try:
        ipaddress.ip_address(domain)
        return True
    except Exception:
        return False


def spoofed_brand(domain):

    for trusted in TRUSTED_DOMAINS:

        similarity = difflib.SequenceMatcher(
            None,
            domain,
            trusted
        ).ratio()

        if similarity > 0.82 and domain != trusted:

            return True, trusted

    return False, None

    for trusted in TRUSTED_DOMAINS:

        similarity = difflib.SequenceMatcher(
            None,
            domain,
            trusted
        ).ratio()

        if similarity > 0.82 and domain != trusted:

            return True, trusted

    return False, None

def analyze_url(url):

    score = 0

    reasons = []

    parsed = urlparse(url)

    domain = parsed.netloc.replace("www.", "")

    if parsed.scheme != "https":
        score += 15
        reasons.append("Uses HTTP")

    if is_trusted_domain(domain):

        score -= 40

    else:

        score += 20
        reasons.append("Unknown domain")

    if bad_tld(domain):

        score += 25
        reasons.append("Suspicious domain extension")

    if is_ip(domain):

        score += 30
        reasons.append("Uses IP Address")

    fake, original = spoofed_brand(domain)

    if fake:

        score += 45
        reasons.append(
            f"Looks similar to {original}"
        )

    if len(url) > 100:

        score += 10
        reasons.append("Very long URL")

    return score, reasons

# -----------------------------
# Credential Theft Detection
# -----------------------------

def detect_credentials(text):

    score = 0
    reasons = []

    text = text.lower()

    for word in CREDENTIAL_WORDS:

        if word in text:
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

        if word in text:
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

        if ext in text.lower():
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