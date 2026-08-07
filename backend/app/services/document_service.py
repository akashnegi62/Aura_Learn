from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.document import Document
from app.services.pdf_service import extract_text_from_pdf
from app.services.docx_service import extract_text_from_docx
from app.models.study_history import StudyHistory
import uuid

from typing import Optional

async def process_and_save_document(file: UploadFile, db: AsyncSession, user_id: Optional[str] = None) -> Document:
    """
    Reads an uploaded file, extracts text based on its type, and saves it to the database.
    """
    filename = file.filename or "unknown"
    content_type = file.content_type
    
    # Read file into memory
    file_bytes = await file.read()
    
    text = ""
    
    # Extract text based on file type
    if content_type == "application/pdf" or filename.lower().endswith(".pdf"):
        text = extract_text_from_pdf(file_bytes)
    elif content_type in ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"] or filename.lower().endswith((".docx", ".doc")):
        text = extract_text_from_docx(file_bytes)
    elif content_type == "text/plain" or filename.lower().endswith(".txt"):
        text = file_bytes.decode("utf-8")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF, DOCX, or TXT.")

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract any text from the document.")

    # Save to database
    db_document = Document(
        filename=filename,
        text=text,
        user_id=user_id
    )
    db.add(db_document)
    
    # Log to study history
    history = StudyHistory(action=f"uploaded_doc: {filename}", user_id=user_id)
    db.add(history)
    
    await db.commit()
    await db.refresh(db_document)
    
    return db_document
