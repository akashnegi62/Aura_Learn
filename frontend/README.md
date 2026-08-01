# AuraLearn

Intelligence, distilled. AuraLearn is an AI-powered platform that transforms your documents (PDFs, DOCX) into interactive study materials in seconds. 

## 🎨 The Steep Aesthetic
This frontend is built using a highly restrained, editorial design system known as **Steep**. 
- **Monochrome & Serif Typography**: Uses `Newsreader` serif headlines contrasting against clean `Inter` sans-serif body copy.
- **Pure CSS**: Fully bespoke design system implemented entirely in Vanilla CSS—no Tailwind or external component libraries.
- **Micro-interactions**: Features custom CSS `@keyframes` for smooth fade-ins, 3D card flips (on the flashcards page), and satisfying hover states.
- **Restrained Palette**: Primarily Ink Black (`#17191c`), Paper White (`#ffffff`), and Mist Gray (`#f2f2f3`), punctuated by a single Blush Peach (`#fbe1d1`) accent color.

## 🚀 Core Features
- **Document Processing**: Upload any PDF or DOCX file to instantly extract text for analysis.
- **Interactive Flashcards**: Generate beautiful 3D-flipping flashcards for spaced repetition.
- **Dynamic Quizzes**: Test your knowledge with multiple-choice quizzes that provide instant feedback and explanations for every answer.
- **AI-Powered**: Uses Gemini (with Groq fallback orchestration) to accurately and contextually parse your documents.

## 🛠 Tech Stack
### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS (Global Variables & Modular Styles)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Data Fetching**: Axios, React hooks

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM**: SQLAlchemy (Async) with Alembic for migrations
- **AI Integration**: Custom fail-safe orchestration using Gemini 1.5 with fallback to Groq (`llama-3.1-8b-instant`)
- **Document Parsing**: `pdfplumber` and `python-docx`

## 💻 Getting Started

### 1. Backend Setup
Navigate to the `backend` directory and set up your virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
Make sure you have your `.env` configured with your `SUPABASE_URL`, `SUPABASE_KEY`, `GEMINI_API_KEY`, and `GROQ_API_KEY`. 
Then start the FastAPI server:
```bash
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
In a new terminal, navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure
### Backend (`/backend`)
- `/app/api`: FastAPI route handlers (endpoints for uploading, generating flashcards/quizzes).
- `/app/models` & `/app/schemas`: SQLAlchemy models and Pydantic validation schemas.
- `/app/services`: Core logic (AI Orchestration, prompt generation, document text extraction).
- `/app/database`: Database connection and Supabase initialization.
- `/alembic`: Database migration scripts.

### Frontend (`/frontend`)
- `/src/app`: Next.js App Router pages (Dashboard, Upload, Flashcards, Quizzes).
- `/src/components/ui`: Reusable, highly-styled UI components (`Button`, `Card`, `Navigation`, `Loader`).
- `/src/lib`: Utilities (e.g., Axios API instances for communicating with the FastAPI backend).
