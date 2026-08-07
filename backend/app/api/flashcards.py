from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.session import get_db
from app.models.flashcard import Flashcard
from app.schemas.flashcard import FlashcardResponse, FlashcardListResponse

from typing import Optional
from app.api.deps import get_current_user

router = APIRouter(prefix="/flashcards", tags=["Flashcards"])

@router.get("", response_model=FlashcardListResponse)
async def get_all_flashcards(
    db: AsyncSession = Depends(get_db),
    user_id: Optional[str] = Depends(get_current_user)
):
    if not user_id:
        return {"flashcards": []}

    result = await db.execute(
        select(Flashcard)
        .where(Flashcard.user_id == user_id)
        .order_by(Flashcard.topic)
    )
    cards = result.scalars().all()
    return {"flashcards": cards}

@router.get("/{flashcard_id}", response_model=FlashcardResponse)
async def get_flashcard(
    flashcard_id: str, 
    db: AsyncSession = Depends(get_db),
    user_id: Optional[str] = Depends(get_current_user)
):
    query = select(Flashcard).where(Flashcard.id == flashcard_id)
    if user_id:
        query = query.where(Flashcard.user_id == user_id)
        
    result = await db.execute(query)
    card = result.scalar_one_or_none()
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    return card
