import google.generativeai as genai
from app.core.config import settings
import json
import re

# Configure Gemini once
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

def extract_json(text: str) -> str:
    """Extracts JSON from markdown code blocks if present."""
    match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
    if match:
        return match.group(1)
    return text

async def generate_with_gemini(system_prompt: str, user_prompt: str) -> str:
    """
    Calls the Gemini 1.5 Flash model and returns the raw JSON string.
    """
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured")

    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    
    combined_prompt = f"System Instructions:\n{system_prompt}\n\nUser Request:\n{user_prompt}"
    
    response = await model.generate_content_async(
        combined_prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.3
        )
    )
    
    return extract_json(response.text)
