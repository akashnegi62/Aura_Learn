from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.session import get_db
from app.models.flashcard import Flashcard
from app.schemas.flashcard import FlashcardResponse, FlashcardListResponse

router = APIRouter(prefix="/flashcards", tags=["Flashcards"])

@router.get("", response_model=FlashcardListResponse)
async def get_all_flashcards(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Flashcard).order_by(Flashcard.topic))
    cards = result.scalars().all()
    return {"flashcards": cards}

@router.get("/{flashcard_id}", response_model=FlashcardResponse)
async def get_flashcard(flashcard_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Flashcard).where(Flashcard.id == flashcard_id))
    card = result.scalar_one_or_none()
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    return card
