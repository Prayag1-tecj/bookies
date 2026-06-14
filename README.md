# 📚 Bookies — AI-Powered Book Mentor (Backend)

> Turn books into conversations.

Bookies is an AI-powered Book Mentor platform that enables users to upload books and ask natural language questions about their content. The backend is built using Django REST Framework and follows a Retrieval-Augmented Generation (RAG) architecture to deliver context-aware answers grounded in the uploaded books.

**Backend Status:** ✅ Complete
**Frontend Status:** 🚧 In Development
**Full Product Launch:** Coming Soon

---

# 🚀 Features

## Authentication & User Management

* JWT Authentication
* User Registration
* User Login
* Protected APIs
* User-based Data Isolation

## Book Management

* Upload Books
* List Uploaded Books
* Delete Books
* File Validation
* File Upload Limits

## Supported Formats

* PDF
* EPUB
* DOCX
* TXT

## Document Processing Pipeline

* Text Extraction
* Intelligent Chunking
* Embedding Generation
* Embedding Storage
* Semantic Retrieval

## AI-Powered Question Answering

* Retrieval-Augmented Generation (RAG)
* Semantic Search
* Context-Aware Responses
* Gemini 2.5 Flash Integration

## Chat System

* Chat Sessions
* Session Management
* Chat History Tracking
* Conversation Persistence

## Usage Management

* Daily Question Limits
* Upload Limits
* Usage Tracking

---

# 🏗️ System Architecture

## High-Level Flow

```text
User
 │
 ▼
JWT Authentication
 │
 ▼
Book Upload API
 │
 ▼
Document Processing Pipeline
 │
 ├── Text Extraction
 ├── Chunking
 ├── Embedding Generation
 └── Embedding Storage
 │
 ▼
PostgreSQL Database
 │
 ▼
User Question
 │
 ▼
Question Embedding
 │
 ▼
Semantic Retrieval
 │
 ▼
Top Relevant Chunks
 │
 ▼
Gemini 2.5 Flash
 │
 ▼
Context-Aware Answer
```

---

# ⚙️ Backend Architecture

```text
apps/
│
├── accounts/
│   ├── authentication
│   ├── user management
│   └── usage tracking
│
├── books/
│   ├── upload management
│   ├── document processing
│   ├── chunk generation
│   ├── embedding generation
│   └── retrieval services
│
├── chat/
│   ├── chat sessions
│   ├── chat messages
│   ├── history tracking
│   └── question answering
│
└── core/
    ├── utilities
    ├── permissions
    └── shared services
```

---

# 🧠 RAG Pipeline

## Step 1 — Upload

Users upload books through the Book Upload API.

Supported formats:

```text
PDF
EPUB
DOCX
TXT
```

---

## Step 2 — Text Extraction

The system extracts raw text from uploaded documents.

```text
Book
 ↓
Raw Text
```

---

## Step 3 — Chunking

Large documents are split into smaller chunks.

```text
Book Text
 ↓
Chunk 1
Chunk 2
Chunk 3
...
Chunk N
```

This improves retrieval quality and keeps AI context efficient.

---

## Step 4 — Embedding Generation

Each chunk is converted into a vector representation using:

```text
Sentence Transformers
all-MiniLM-L6-v2
```

Output:

```text
Chunk
 ↓
384-Dimensional Vector
```

---

## Step 5 — Storage

The following data is persisted:

```text
Books
Chunks
Embeddings
Chat Sessions
Messages
Usage Data
Users
```

using PostgreSQL.

---

## Step 6 — Question Processing

When a user asks a question:

```text
Question
 ↓
Question Embedding
```

The same embedding model converts the question into a vector.

---

## Step 7 — Semantic Retrieval

Using cosine similarity:

```text
Question Vector
 ↓
Similarity Search
 ↓
Top Relevant Chunks
```

The system retrieves the most relevant content from the uploaded book.

---

## Step 8 — Gemini Response Generation

Retrieved chunks are sent as context to:

```text
Google Gemini 2.5 Flash
```

Prompt Structure:

```text
Question
+
Retrieved Context
=
Grounded Response
```

This reduces hallucinations and ensures answers remain book-specific.

---

# 🗄️ Database Design

## Core Models

### User

```text
Authentication
Profile
Usage Tracking
```

### Book

```text
Title
File
Owner
Upload Date
```

### Chunk

```text
Book Reference
Chunk Content
Chunk Index
```

### ChunkEmbedding

```text
Chunk Reference
Embedding Vector
```

### ChatSession

```text
User
Book
Title
Created At
```

### ChatMessage

```text
Session
Role
Content
Timestamp
```

---

# 🔐 Security Features

* JWT Authentication
* Protected Endpoints
* User-Based Access Control
* Resource Ownership Validation
* Upload Restrictions
* Usage Limit Enforcement

---

# 📡 API Modules

## Authentication APIs

```text
POST /api/auth/register/
POST /api/auth/login/
```

---

## Book APIs

```text
POST   /api/books/upload/
GET    /api/books/
DELETE /api/books/{id}/
```

---

## Chat APIs

```text
POST /api/chat/ask/
GET  /api/chat/history/{session_id}/
POST /api/chat/sessions/
GET  /api/chat/sessions/
DELETE /api/chat/sessions/{id}/
```

---

# 🛠️ Tech Stack

## Backend

* Python
* Django
* Django REST Framework

## Database

* PostgreSQL
* Neon (Hosting)

## AI & NLP

* Google Gemini 2.5 Flash
* Sentence Transformers
* all-MiniLM-L6-v2

## Authentication

* JWT Authentication

## APIs

* REST APIs

---

# 📈 Challenges Solved

### Semantic Search

Moved beyond keyword matching by implementing embedding-based retrieval.

### Context Management

Built retrieval pipelines to keep prompts relevant and efficient.

### Multi-Format Parsing

Created a unified document processing pipeline for multiple file formats.

### Scalable Architecture

Separated authentication, book processing, retrieval, and chat systems into modular services.

---

# 🎯 Learning Outcomes

Through Bookies, I gained hands-on experience with:

* Retrieval-Augmented Generation (RAG)
* Semantic Search
* Embedding Models
* LLM Integration
* Django REST Framework
* JWT Authentication
* PostgreSQL Database Design
* API Development
* Modular Backend Architecture
* AI Application Development

---

# 🔮 Roadmap

### Completed

* Authentication System
* Book Upload Pipeline
* Text Extraction
* Chunking Engine
* Embedding Generation
* Semantic Retrieval
* Gemini Integration
* Chat Sessions
* Chat History
* Usage Limits

### Coming Soon

* React Frontend
* Interactive Dashboard
* Book Library UI
* Chat Interface
* SaaS Usage Analytics
* Cloud Deployment
* Full Product Launch

---

# 📬 Author

Built by Prayag Shrivastava

Bookies is an AI-powered platform designed to help readers interact with books through intelligent, context-aware conversations powered by Retrieval-Augmented Generation (RAG).

⭐ Full application launch coming soon.
