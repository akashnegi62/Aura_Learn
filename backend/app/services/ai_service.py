from loguru import logger
import json
from app.services.gemini_service import generate_with_gemini
from app.services.groq_service import generate_with_groq
from app.services.prompts import FLASHCARD_SYSTEM_PROMPT, QUIZ_SYSTEM_PROMPT
from app.schemas.flashcard import FlashcardBase
from app.schemas.quiz import QuizQuestionBase, DifficultyEnum
from typing import List, Union

async def _orchestrate_generation(system_prompt: str, user_prompt: str) -> list[dict]:
    """
    Attempts to generate JSON using Gemini. If it fails or returns invalid JSON,
    it falls back to Groq exactly ONCE.
    """
    try:
        logger.info("Attempting generation with Gemini...")
        raw_json = await generate_with_gemini(system_prompt, user_prompt)
        data = json.loads(raw_json)
        # Handle cases where the LLM wraps the array in an object
        if isinstance(data, dict):
            # Find the first array value
            for key, val in data.items():
                if isinstance(val, list):
                    return val
            return [data]
        return data
    except Exception as gemini_err:
        logger.warning(f"Gemini generation failed: {str(gemini_err)}. Falling back to Groq...")
        try:
            raw_json = await generate_with_groq(system_prompt, user_prompt)
            data = json.loads(raw_json)
            if isinstance(data, dict):
                for key, val in data.items():
                    if isinstance(val, list):
                        return val
                return [data]
            return data
        except Exception as groq_err:
            logger.error(f"Groq fallback also failed: {str(groq_err)}")
            raise ValueError("Both primary AI (Gemini) and fallback AI (Groq) failed to generate valid JSON.")

async def generate_flashcards(text: str, num_cards: int = 10) -> List[FlashcardBase]:
    user_prompt = f"Please generate {num_cards} flashcards based on this text:\n\n{text}"
    
    raw_data = await _orchestrate_generation(FLASHCARD_SYSTEM_PROMPT, user_prompt)
    
    # Validate with Pydantic
    validated_cards = []
    for item in raw_data:
        try:
            validated_cards.append(FlashcardBase(**item))
        except Exception as e:
            logger.warning(f"Skipping invalid flashcard item: {item}. Error: {e}")
            
    if not validated_cards:
        raise ValueError("AI did not return any valid flashcards matching the schema.")
        
    return validated_cards

async def generate_quiz(text: str, difficulty: DifficultyEnum, num_questions: int = 10) -> List[QuizQuestionBase]:
    system_prompt = QUIZ_SYSTEM_PROMPT.format(difficulty=difficulty.value)
    user_prompt = f"Please generate a {num_questions}-question quiz based on this text:\n\n{text}"
    
    raw_data = await _orchestrate_generation(system_prompt, user_prompt)
    
    # Validate with Pydantic
    validated_questions = []
    for item in raw_data:
        try:
            validated_questions.append(QuizQuestionBase(**item))
        except Exception as e:
            logger.warning(f"Skipping invalid quiz question item: {item}. Error: {e}")
            
    if not validated_questions:
        raise ValueError("AI did not return any valid quiz questions matching the schema.")
        
    return validated_questions
