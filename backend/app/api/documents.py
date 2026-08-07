from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.database.session import get_db
from app.services.document_service import process_and_save_document
from app.schemas.document import DocumentResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/upload", tags=["Documents"])

@router.post("", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: Optional[str] = Depends(get_current_user)
):
    """
    Uploads a PDF, DOCX, or TXT file, extracts the text, and stores it in the database.
    Returns the document metadata and extracted text.
    """
    document = await process_and_save_document(file, db, user_id)
    return document
