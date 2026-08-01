from groq import AsyncGroq
from app.core.config import settings
import json
import re

# Initialize client lazily or safely
groq_client = None
if settings.GROQ_API_KEY:
    groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)

def extract_json(text: str) -> str:
    """Extracts JSON from markdown code blocks if present."""
    match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
    if match:
        return match.group(1)
    return text

async def generate_with_groq(system_prompt: str, user_prompt: str) -> str:
    """
    Calls the Groq API (llama3-8b-8192) as a fallback and returns the raw JSON string.
    """
    if not groq_client:
        raise ValueError("GROQ_API_KEY is not configured")

    response = await groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        model="llama-3.1-8b-instant",
        temperature=0.3,
        response_format={"type": "json_object"} # Depending on Groq support, this helps
    )
    
    content = response.choices[0].message.content or ""
    return extract_json(content)
