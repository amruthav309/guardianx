from io import BytesIO
from datetime import datetime

from reportlab.lib.colors import red, green, black
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer


def generate_pdf_report(result):

    buffer = BytesIO()

    doc = SimpleDocTemplate(buffer)

    styles = getSampleStyleSheet()

    story = []

    story.append(
        Paragraph("<b><font size=20>GuardianX Security Report</font></b>", styles["Title"])
    )

    story.append(Spacer(1, 20))

    story.append(
        Paragraph(
            f"<b>Date :</b> {datetime.now().strftime('%d-%m-%Y %H:%M:%S')}",
            styles["Normal"]
        )
    )

    story.append(Spacer(1, 15))

    color = red if result["status"] == "Phishing" else green

    story.append(
        Paragraph(
            f"<b>Status :</b> <font color='{color.hexval()}'>{result['status']}</font>",
            styles["Heading2"]
        )
    )

    story.append(
        Paragraph(
            f"<b>Confidence :</b> {result['confidence']}%",
            styles["Normal"]
        )
    )

    story.append(Spacer(1, 15))

    story.append(
        Paragraph("<b>Matched Words</b>", styles["Heading2"])
    )

    if result["matched_words"]:

        for word in result["matched_words"]:
            story.append(
                Paragraph(f"• {word}", styles["Normal"])
            )

    else:

        story.append(
            Paragraph("No suspicious words detected.", styles["Normal"])
        )

    story.append(Spacer(1, 15))

    if "advisor" in result:

        story.append(
            Paragraph("<b>AI Security Advisor</b>", styles["Heading2"])
        )

        story.append(
            Paragraph(
                f"<b>Risk :</b> {result['advisor']['risk']}",
                styles["Normal"]
            )
        )

        story.append(Spacer(1, 10))

        story.append(
            Paragraph("<b>Reasons</b>", styles["Heading3"])
        )

        for reason in result["advisor"]["reason"]:

            story.append(
                Paragraph(f"• {reason}", styles["Normal"])
            )

        story.append(Spacer(1, 10))

        story.append(
            Paragraph("<b>Recommendations</b>", styles["Heading3"])
        )

        for recommendation in result["advisor"]["recommendation"]:

            story.append(
                Paragraph(f"• {recommendation}", styles["Normal"])
            )

    doc.build(story)

    buffer.seek(0)

    return buffer