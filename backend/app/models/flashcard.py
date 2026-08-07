from sqlalchemy import Column, String, Text, ForeignKey, Index
from app.models.base import Base
import uuid
from sqlalchemy.dialects.postgresql import TSVECTOR

class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), index=True, nullable=True)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    topic = Column(String(255), nullable=True)
    
    # We might add a tsvector column for full text search if we are doing raw SQL
    # Alternatively we can query it dynamically
    # fts_vector = Column(TSVECTOR)
