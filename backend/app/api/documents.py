from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.document_service import process_and_save_document
from app.schemas.document import DocumentResponse

router = APIRouter(prefix="/upload", tags=["Documents"])

@router.post("", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Uploads a PDF, DOCX, or TXT file, extracts the text, and stores it in the database.
    Returns the document metadata and extracted text.
    """
    document = await process_and_save_document(file, db)
    return document
