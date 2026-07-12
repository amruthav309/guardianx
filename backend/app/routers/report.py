from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.utils.pdf_report import generate_pdf_report

router = APIRouter()


@router.post("/download")
def download_report(result: dict):

    pdf = generate_pdf_report(result)

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=GuardianX_Report.pdf"
        }
    )