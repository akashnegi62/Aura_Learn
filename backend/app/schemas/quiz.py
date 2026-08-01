from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from app.models.quiz import DifficultyEnum

# --- Quiz Question Schemas ---
class QuizQuestionBase(BaseModel):
    question: str
    options: List[str]
    answer: str
    explanation: Optional[str] = None

class QuizQuestionCreate(QuizQuestionBase):
    quiz_id: str

class QuizQuestionResponse(QuizQuestionBase):
    id: str
    quiz_id: str

    model_config = ConfigDict(from_attributes=True)

# --- Quiz Schemas ---
class QuizBase(BaseModel):
    difficulty: DifficultyEnum

class QuizCreate(QuizBase):
    document_id: str

class QuizResponse(QuizBase):
    id: str
    document_id: str
    created_at: datetime
    questions: List[QuizQuestionResponse] = []

    model_config = ConfigDict(from_attributes=True)

class QuizGenerateRequest(BaseModel):
    document_id: str
    difficulty: DifficultyEnum = DifficultyEnum.medium
    num_questions: int = 10

# --- Quiz Attempt Schemas ---
class QuizAttemptCreate(BaseModel):
    quiz_id: str
    score: int
    total: int

class QuizAttemptResponse(QuizAttemptCreate):
    id: str
    completed_at: datetime

    model_config = ConfigDict(from_attributes=True)
