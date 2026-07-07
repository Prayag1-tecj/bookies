# 📚 Bookies

> **An AI-powered Book Mentor that transforms books into interactive
> conversations using Retrieval-Augmented Generation (RAG), semantic
> search, and Google Gemini.**

Bookies enables readers to upload books and interact with them through
natural language. Instead of relying on the language model's general
knowledge, Bookies retrieves the most relevant passages from the
uploaded document and uses them to generate grounded, context-aware
responses.

------------------------------------------------------------------------

## Live Demo

**Application:** https://bookies-nu.vercel.app

> **Note:** The backend is hosted on Render's free tier and may take up
> to a minute to wake up after inactivity.

## Features

-   JWT Authentication
-   Multi-format document upload (PDF, EPUB, DOCX, TXT)
-   Retrieval-Augmented Generation (RAG)
-   Semantic search with Sentence Transformers
-   Google Gemini 2.5 Flash integration
-   Book-specific workspaces
-   Persistent chat sessions
-   Markdown responses
-   Production deployment on Vercel, Render and Neon PostgreSQL

## Technology Stack

  Layer        Technologies
  ------------ ---------------------------------------
  Frontend     React, TypeScript, Vite, Tailwind CSS
  Backend      Django REST Framework
  Database     PostgreSQL (Neon)
  AI           Google Gemini 2.5 Flash
  Embeddings   all-MiniLM-L6-v2
  Deployment   Vercel, Render

## Architecture

![Architecture](assets/screenshots/BackEnd_Architecture.png)

## Project Structure

``` text
Bookies/
├── backend/
├── frontend/
├── assets/
├── README.md
├── ARCHITECTURE.md
├── API.md
└── DEPLOYMENT.md
```

## Running Locally

### Backend

``` bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

``` bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Backend:

``` env
SECRET_KEY=
DEBUG=False
DATABASE_URL=
GEMINI_API_KEY=
ALLOWED_HOSTS=
CORS_ALLOWED_ORIGINS=
```

Frontend:

``` env
VITE_API_BASE_URL=http://localhost:8000
```

## Engineering Highlights

-   End-to-end RAG pipeline
-   Semantic retrieval
-   Context-grounded LLM responses
-   Modular Django architecture
-   Ownership-based authorization
-   Production deployment

## Roadmap

### Completed

-   Authentication
-   Document ingestion
-   RAG
-   Chat sessions
-   Deployment

### Planned

-   Streaming responses
-   OCR support
-   Hybrid search
-   Book summarization

## Documentation

-   ARCHITECTURE.md
-   API.md
-   DEPLOYMENT.md

## Author

**Prayag Raj Shrivastava**

-   GitHub: https://github.com/Prayag1-tecj
-   LinkedIn:
    https://www.linkedin.com/in/prayag-raj-shrivastava-129875293
-   Email: prayag.raj.9887@gmail.com

## License

MIT License.
