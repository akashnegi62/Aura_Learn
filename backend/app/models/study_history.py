from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from app.models.base import Base
import uuid

class StudyHistory(Base):
    __tablename__ = "study_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    action = Column(String(255), nullable=False) # e.g. "generated_flashcards", "took_quiz", "uploaded_doc"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
