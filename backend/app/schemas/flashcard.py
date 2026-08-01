from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class FlashcardBase(BaseModel):
    question: str
    answer: str
    explanation: Optional[str] = None
    topic: Optional[str] = None

class FlashcardCreate(FlashcardBase):
    document_id: str

class FlashcardResponse(FlashcardBase):
    id: str
    document_id: str
    
    model_config = ConfigDict(from_attributes=True)

class FlashcardGenerateRequest(BaseModel):
    document_id: str
    num_cards: int = 10

class FlashcardListResponse(BaseModel):
    flashcards: List[FlashcardResponse]
