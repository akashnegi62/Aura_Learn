from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)

# Import routers
from app.api.documents import router as documents_router
from app.api.generate import router as generate_router
from app.api.flashcards import router as flashcards_router
from app.api.quizzes import router as quizzes_router
from app.api.dashboard import router as dashboard_router

app = FastAPI(
    title="AI Flashcard & Quiz Generator",
    description="API for generating flashcards and quizzes using AI",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Include routers
app.include_router(documents_router, prefix="/api/v1")
app.include_router(generate_router, prefix="/api/v1")
app.include_router(flashcards_router, prefix="/api/v1")
app.include_router(quizzes_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
