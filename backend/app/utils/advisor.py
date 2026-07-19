def generate_advice(status, matched_words):

    if status == "Safe":

        return {
            "risk": "LOW",
            "reason": [
                "No significant phishing indicators were detected.",
                "The content appears safe based on the current rules."
            ],
            "recommendation": [
                "Continue using normal security practices.",
                "Always verify unknown senders before sharing personal information."
            ]
        }

    reasons = []
    recommendations = []

    # Check for substring matches in the matched_words list
    for word in matched_words:
        wl = word.lower()
        if "login" in wl and "Requests login credentials." not in reasons:
            reasons.append("Requests login credentials.")
        if "password" in wl and "Requests your password." not in reasons:
            reasons.append("Requests your password.")
        if "verify" in wl and "Asks you to verify your account." not in reasons:
            reasons.append("Asks you to verify your account.")
        if "urgent" in wl and "Creates a sense of urgency." not in reasons:
            reasons.append("Creates a sense of urgency.")
        if "bank" in wl and "Pretends to be from a bank." not in reasons:
            reasons.append("Pretends to be from a bank.")
        if "click" in wl and "Encourages clicking an unknown link." not in reasons:
            reasons.append("Encourages clicking an unknown link.")
        if ("winner" in wl or "prize" in wl or "lottery" in wl or "gift" in wl or "free" in wl) and "Claims you won a reward." not in reasons:
            reasons.append("Claims you won a reward.")

    # Fallback to copy over original descriptions if no rules matched
    if not reasons:
        for r in matched_words:
            cleaned = r.replace("Credential request: ", "Requested ").replace("Social engineering: ", "Contains ").replace("Dangerous attachment ", "Contains dangerous file ")
            if cleaned not in reasons:
                reasons.append(cleaned)

    # General fallback
    if not reasons:
        reasons.append("Analyzed content contains general suspicious indicators.")

    recommendations.extend([
        "Do not click suspicious links.",
        "Do not share passwords or OTPs.",
        "Verify the sender using the official website.",
        "Report the message as phishing if appropriate.",
        "Delete the message if it appears fraudulent."
    ])

    return {
        "risk": "HIGH",
        "reason": reasons,
        "recommendation": recommendations
    }