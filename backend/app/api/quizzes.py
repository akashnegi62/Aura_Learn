from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from app.database.session import get_db
from app.models.quiz import Quiz
from app.models.quiz_question import QuizQuestion
from app.models.quiz_attempt import QuizAttempt
from app.models.study_history import StudyHistory
from app.schemas.quiz import QuizResponse, QuizAttemptCreate, QuizAttemptResponse

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

@router.get("", response_model=List[QuizResponse])
async def list_quizzes(db: AsyncSession = Depends(get_db)):
    # Need to load questions with it or just return the quiz metadata
    result = await db.execute(
        select(Quiz)
        .order_by(Quiz.created_at.desc())
    )
    quizzes = result.scalars().all()
    
    # We load questions manually for schema
    for q in quizzes:
        qr = await db.execute(select(QuizQuestion).where(QuizQuestion.quiz_id == q.id))
        q.questions = qr.scalars().all()
        
    return quizzes

@router.post("/submit", response_model=QuizAttemptResponse)
async def submit_quiz(attempt: QuizAttemptCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Quiz).where(Quiz.id == attempt.quiz_id))
    quiz = result.scalar_one_or_none()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    db_attempt = QuizAttempt(**attempt.model_dump())
    db.add(db_attempt)
    db.add(StudyHistory(action=f"took_quiz: {quiz.id} scored {attempt.score}/{attempt.total}"))
    
    await db.commit()
    await db.refresh(db_attempt)
    return db_attempt
