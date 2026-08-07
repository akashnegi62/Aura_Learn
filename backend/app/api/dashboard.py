from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.database.session import get_db
from app.models.flashcard import Flashcard
from app.models.quiz import Quiz
from app.models.document import Document
from app.models.study_history import StudyHistory
from pydantic import BaseModel
from app.api.deps import get_current_user
from typing import List, Optional

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

class DashboardStats(BaseModel):
    total_flashcards: int
    total_quizzes: int
    total_documents: int

class HistoryItem(BaseModel):
    id: str
    action: str
    created_at: str

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    user_id: Optional[str] = Depends(get_current_user)
):
    if not user_id:
        return DashboardStats(total_flashcards=0, total_quizzes=0, total_documents=0)

    fc_count = await db.scalar(select(func.count(Flashcard.id)).where(Flashcard.user_id == user_id))
    quiz_count = await db.scalar(select(func.count(Quiz.id)).where(Quiz.user_id == user_id))
    doc_count = await db.scalar(select(func.count(Document.id)).where(Document.user_id == user_id))
    
    return DashboardStats(
        total_flashcards=fc_count or 0,
        total_quizzes=quiz_count or 0,
        total_documents=doc_count or 0
    )

@router.get("/history", response_model=List[HistoryItem])
async def get_history(
    limit: int = 50, 
    db: AsyncSession = Depends(get_db),
    user_id: Optional[str] = Depends(get_current_user)
):
    if not user_id:
        return []

    result = await db.execute(
        select(StudyHistory)
        .where(StudyHistory.user_id == user_id)
        .order_by(StudyHistory.created_at.desc())
        .limit(limit)
    )
    history = result.scalars().all()
    return [
        HistoryItem(id=str(h.id), action=h.action, created_at=h.created_at.isoformat())
        for h in history
    ]

@router.delete("/history/{history_id}")
async def delete_history(
    history_id: str, 
    db: AsyncSession = Depends(get_db),
    user_id: Optional[str] = Depends(get_current_user)
):
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = await db.execute(
        select(StudyHistory)
        .where(StudyHistory.id == history_id)
        .where(StudyHistory.user_id == user_id)
    )
    h = result.scalar_one_or_none()
    if h:
        await db.delete(h)
        await db.commit()
    return {"status": "ok"}
