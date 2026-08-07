from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.session import get_db
from app.models.document import Document
from app.models.flashcard import Flashcard
from app.models.quiz import Quiz
from app.models.quiz_question import QuizQuestion
from app.models.study_history import StudyHistory
from app.schemas.flashcard import FlashcardGenerateRequest, FlashcardListResponse, FlashcardResponse
from app.schemas.quiz import QuizGenerateRequest, QuizResponse, QuizQuestionResponse
from app.services.ai_service import generate_flashcards, generate_quiz

router = APIRouter(prefix="/generate", tags=["Generation"])

from typing import Optional
from app.api.deps import get_current_user

@router.post("/flashcards", response_model=FlashcardListResponse)
async def generate_flashcards_api(
    req: FlashcardGenerateRequest,
    db: AsyncSession = Depends(get_db),
    user_id: Optional[str] = Depends(get_current_user)
):
    # Verify doc exists
    result = await db.execute(select(Document).where(Document.id == req.document_id))
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Generate
    try:
        flashcard_data = await generate_flashcards(document.text, req.num_cards)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

    # Save
    saved_cards = []
    for fc_data in flashcard_data:
        db_fc = Flashcard(
            document_id=document.id,
            question=fc_data.question,
            answer=fc_data.answer,
            explanation=fc_data.explanation,
            topic=fc_data.topic,
            user_id=user_id
        )
        db.add(db_fc)
        saved_cards.append(db_fc)
    
    # Log
    db.add(StudyHistory(action=f"generated_flashcards: {len(saved_cards)} for doc {document.id}", user_id=user_id))
    await db.commit()
    
    # Refresh to get IDs
    for c in saved_cards:
        await db.refresh(c)
        
    return {"flashcards": saved_cards}

@router.post("/quiz", response_model=QuizResponse)
async def generate_quiz_api(
    req: QuizGenerateRequest,
    db: AsyncSession = Depends(get_db),
    user_id: Optional[str] = Depends(get_current_user)
):
    # Verify doc
    result = await db.execute(select(Document).where(Document.id == req.document_id))
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Generate
    try:
        quiz_data = await generate_quiz(document.text, req.difficulty, req.num_questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

    # Create Quiz
    db_quiz = Quiz(
        document_id=document.id,
        difficulty=req.difficulty,
        user_id=user_id
    )
    db.add(db_quiz)
    await db.flush() # get quiz id
    
    # Add questions
    for q_data in quiz_data:
        db_q = QuizQuestion(
            quiz_id=db_quiz.id,
            question=q_data.question,
            options=q_data.options,
            answer=q_data.answer,
            explanation=q_data.explanation
        )
        db.add(db_q)
        
    db.add(StudyHistory(action=f"generated_quiz: {db_quiz.id}", user_id=user_id))
    await db.commit()
    await db.refresh(db_quiz)
    
    # Load questions for response
    q_result = await db.execute(select(QuizQuestion).where(QuizQuestion.quiz_id == db_quiz.id))
    db_quiz.questions = q_result.scalars().all()
    
    return db_quiz
