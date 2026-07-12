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

    if "login" in matched_words:
        reasons.append("Requests login credentials.")

    if "password" in matched_words:
        reasons.append("Requests your password.")

    if "verify" in matched_words:
        reasons.append("Asks you to verify your account.")

    if "urgent" in matched_words:
        reasons.append("Creates a sense of urgency.")

    if "bank" in matched_words:
        reasons.append("Pretends to be from a bank.")

    if "click" in matched_words:
        reasons.append("Encourages clicking an unknown link.")

    if "winner" in matched_words or "prize" in matched_words:
        reasons.append("Claims you won a reward.")

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