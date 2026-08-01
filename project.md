# PROJECT SPECIFICATION: AI Flashcard & Quiz Generator

## 🛑 AI AGENT INSTRUCTIONS
- Read this document completely before generating any code.
- Write production-ready code ONLY. No placeholders, mock data, or `// TODO` comments.
- Strictly adhere to the specified tech stack versions (e.g., Pydantic v2, SQLAlchemy 2.0, Next.js 15 App Router).
- Implement clean architecture. Separate concerns strictly between API, Services, Repositories, and Models.

## 1. TECH STACK
### Frontend
- **Framework:** Next.js 15 (App Router),TypeScript (Strict)
- **Styling:** Tailwind CSS, framer-motion
- **State & Data:** Zustand, TanStack Query, Axios
- **Forms & Validation:** React Hook Form, Zod
- **Charts:** Recharts

### Backend
- **Framework:** Python 3.12+, FastAPI, Uvicorn
- **Data & ORM:** Pydantic v2, SQLAlchemy 2.0, Alembic, Psycopg
- **HTTP & Utils:** HTTPX, python-dotenv, Loguru, SlowAPI (Rate limiting)
- **File Parsing:** PyMuPDF (PDF), python-docx (DOCX), python-multipart

### Database & AI
- **DB:** Supabase PostgreSQL (Use PG Full-Text Search for flashcards)
- **Primary AI:** Gemini (Free Tier)
- **Fallback AI:** Groq (Free Tier) - *Auto-fallback if Gemini fails*

## 2. CORE BUSINESS RULES
1. **No Authentication:** Public access. Store only generated study data.
2. **AI Output:** MUST return strict JSON only. 
3. **AI Validation:** Validate all AI JSON responses with Pydantic models before saving.
4. **AI Retry:** Automatically retry exactly ONCE if the AI returns invalid JSON.
5. **Prompt Management:** Keep all AI prompts centralized in dedicated service modules.

## 3. DATABASE SCHEMA (PostgreSQL)
- **documents**: `id` (PK), `filename`, `text`, `uploaded_at`
- **flashcards**: `id` (PK), `document_id` (FK), `question`, `answer`, `explanation`, `topic`
- **quizzes**: `id` (PK), `document_id` (FK), `difficulty` (Easy/Med/Hard), `created_at`
- **quiz_questions**: `id` (PK), `quiz_id` (FK), `question`, `options` (JSON), `answer`, `explanation`
- **quiz_attempts**: `id` (PK), `quiz_id` (FK), `score`, `total`, `completed_at`
- **study_history**: `id` (PK), `action`, `created_at`

## 4. API ENDPOINTS (FastAPI)
### Ingest & Generate
- `POST /upload` (Accepts PDF, DOCX, TXT, or raw text)
- `POST /generate/flashcards`
- `POST /generate/quiz`
- `POST /quiz/submit`

### Retrieval & Management
- `GET /flashcards`, `GET /flashcards/{id}`
- `GET /quizzes`
- `GET /dashboard` (Returns docs, flashcards, history, avg score, accuracy, weak/strong topics)
- `GET /history`, `DELETE /history/{id}`
- `GET /health`

## 5. ARCHITECTURE & DIRECTORY STRUCTURE
### Backend (`backend/`)
```text
app/
├── api/            # Route definitions
├── core/           # Config, security, dependencies
├── database/       # DB session, engine setup
├── models/         # SQLAlchemy ORM models
├── schemas/        # Pydantic v2 request/response schemas
├── repositories/   # DB CRUD operations
├── services/       # Business logic (ai_service, gemini_service, groq_service, pdf_service, etc.)
├── middleware/     # Rate limiting, logging
├── utils/          # Helpers
└── main.py         # FastAPI app entrypoint

### Frontend (`frontend/`)

app/                # Next.js App Router pages
components/         # UI
features/           # Feature-specific components (upload, quiz, flashcards)
hooks/              # Custom React hooks
services/           # Axios API clients
store/              # Zustand stores
types/              # Global TypeScript types
utils/              # Helpers