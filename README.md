# QueryMindAI

> **Ask your database in plain English.** QueryMindAI transforms natural language questions into MongoDB queries — no syntax, no complexity, just answers.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Client (Frontend)](#client-frontend)
- [Server (Backend)](#server-backend)
- [AI Service (NLP Engine)](#ai-service-nlp-engine)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Security](#security)
- [Environment Variables](#environment-variables)

---

## Overview

QueryMindAI is a full-stack AI-powered web application that lets users query their MongoDB database using natural language. Instead of writing complex MongoDB syntax, users simply type questions like:

- *"Show all users in the IT department"*
- *"Count users by department"*
- *"Find admins with salary greater than 40000"*
- *"Get average salary by department"*

The system detects the user's **intent** (find, count, aggregate), extracts **entities** (fields, values, operators), generates a **MongoDB query or aggregation pipeline**, validates it for **security**, executes it, and returns the results with a full **explanation**.

---

## Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Client (UI)    │────▶│  Server (API)    │────▶│  AI Service      │
│   Next.js        │     │  Express.js      │     │  FastAPI (Python) │
│   Port 3000      │     │  Port 5000       │     │  Port 8000        │
└──────────────────┘     └────────┬─────────┘     └──────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   MongoDB        │
                         │   Port 27017     │
                         └──────────────────┘
```

**Data Flow:**

1. User types a natural language query on the frontend
2. Frontend sends the query to the Express backend (`/api/query/translate`)
3. Backend calls the AI Service (Python) for NLP translation, or uses its built-in fallback NLP
4. AI detects intent, extracts entities, generates MongoDB query
5. Backend validates the query for security (blocks destructive operations, injection)
6. Backend executes the query against MongoDB
7. Results are returned to the frontend with explanation, confidence score, and execution time

---

## Tech Stack

| Layer          | Technology                                                    |
| -------------- | ------------------------------------------------------------- |
| **Frontend**   | Next.js 14, React, Lucide Icons, styled-jsx                  |
| **Backend**    | Node.js, Express.js, Mongoose, Helmet, Morgan, express-rate-limit |
| **AI Service** | Python 3, FastAPI, spaCy, sentence-transformers               |
| **Database**   | MongoDB                                                       |
| **AI Chat**    | Google Gemini 2.0 Flash API (with fallback)                   |
| **Design**     | Glassmorphism, pure black (#000000) + pearl white (#F5F6F7)   |

---

## Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** running locally on port 27017
- **Python 3.9+** (optional — only needed for advanced NLP via the AI service)

### 1. Clone the repository

```bash
git clone <repo-url>
cd querymind-ai
```

### 2. Start the backend

```bash
cd server
npm install
node server.js
```

This starts the Express API on `http://localhost:5000`. It connects to MongoDB at `mongodb://localhost:27017/querymindDB`.

### 3. Start the frontend

```bash
cd client
npm install
npm run dev
```

This starts the Next.js app on `http://localhost:3000`.

### 4. (Optional) Start the AI service

```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

This starts the FastAPI NLP engine on `http://localhost:8000`. If not started, the backend automatically falls back to its built-in NLP engine — **no Python required for basic usage**.

---

## Project Structure

```
querymind-ai/
├── README.md                          # This file
├── client/                            # Frontend — Next.js React app
│   ├── Dockerfile                     # Docker config for frontend
│   ├── jsconfig.json                  # Path alias config (@ → src/)
│   ├── next.config.js                 # Next.js configuration
│   ├── package.json                   # Frontend dependencies
│   ├── public/
│   │   └── favicon.svg                # App favicon (white Q on black)
│   └── src/
│       ├── components/
│       │   ├── chatbot/               # AI chatbot widget
│       │   ├── dashboard/             # Dashboard query components
│       │   ├── landing/               # Landing page sections
│       │   ├── layout/                # Navbar, Footer, Sidebar
│       │   ├── three/                 # 3D/WebGL backgrounds (optional)
│       │   └── ui/                    # Reusable UI primitives
│       ├── hooks/                     # Custom React hooks
│       ├── pages/                     # Next.js pages (routes)
│       ├── styles/                    # Global CSS files
│       └── utils/                     # API client & formatters
├── server/                            # Backend — Express.js API
│   ├── .env                           # Environment variables
│   ├── config/                        # Database configuration
│   ├── controllers/                   # Route handlers
│   ├── middleware/                     # Security & error handling
│   ├── models/                        # Mongoose schemas
│   ├── routes/                        # Express routes
│   ├── server.js                      # Entry point
│   └── services/                      # Business logic & AI
└── ai-service/                        # AI — FastAPI Python NLP
    ├── Dockerfile                     # Docker config for AI service
    ├── app.py                         # FastAPI entry point
    ├── requirements.txt               # Python dependencies
    └── nlp/                           # NLP modules
```

---

## Client (Frontend)

The frontend is a Next.js 14 app with two main pages: the landing page (`/`) and the dashboard (`/dashboard`). It uses a **pure black background (#000000)** with **pearl white text (#F5F6F7)** and **glassmorphism** card effects throughout.

### Pages

| File | Route | Description |
|------|-------|-------------|
| `pages/index.jsx` | `/` | Landing page — assembles all landing sections (Hero, Features, How It Works, Testimonials, FAQ, CTA) with Navbar and Footer |
| `pages/dashboard.jsx` | `/dashboard` | Main query dashboard — input, results, analytics, history, collections, settings, and chatbot |
| `pages/_app.jsx` | all | App wrapper — global CSS imports, page preloader animation, toast notifications, QueryMindAI branding |

### Landing Page Components (`components/landing/`)

| File | Description |
|------|-------------|
| `HeroSection.jsx` | Hero with large heading ("Ask your database in plain English"), inline mock-dashboard visual showing a simulated query result table, and "Get Started" CTA button |
| `FeaturesSection.jsx` | Horizontal scrollable feature cards (Natural Language Queries, AI Understanding, Instant Results, Security, Analytics, Multi-Collection). **Cursor-draggable** — users can click and drag to scroll |
| `AboutSection.jsx` | "How It Works" — 3-step flow: (1) Type your question → (2) AI generates the query → (3) Get your results. Replaces the old tech stack section |
| `TestimonialsSection.jsx` | **Auto-scrolling marquee** of 8 testimonial cards. Infinite horizontal scroll with CSS animation, pauses on hover |
| `FAQSection.jsx` | **Accordion** with 8 frequently asked questions. Click to expand/collapse with Plus/Minus icons and smooth height animation |
| `CTASection.jsx` | Call-to-action with "Get Started — It's Free" button |
| `TechStackSection.jsx` | Legacy tech stack section (no longer used in index.jsx) |

### Layout Components (`components/layout/`)

| File | Description |
|------|-------------|
| `Navbar.jsx` | **Pill-shaped navbar** — centered, max-width 720px, rounded corners (border-radius 50px), floating with glass backdrop blur. Links: Features, How It Works, FAQ. CTA: "Get Started" button. Scrolls to sticky with reduced padding |
| `Footer.jsx` | 4-column footer with QueryMindAI branding, Product/Resources/Company links, social icons (GitHub, Twitter, LinkedIn), copyright |
| `Sidebar.jsx` | Dashboard sidebar navigation with collapsible toggle. Nav items: Query, Analytics, History, Collections, Chat, Settings. QueryMindAI logo with MongoDB icon |

### Dashboard Components (`components/dashboard/`)

| File | Description |
|------|-------------|
| `QueryInput.jsx` | Text input where users type natural language queries. Includes collection dropdown selector and example query suggestions. Glass-styled input with gradient execute button |
| `QueryResult.jsx` | Displays query results in a table or JSON view. Shows result count, execution time, and export options. Handles empty results and errors |
| `QueryExplanation.jsx` | Shows the AI's explanation: detected intent (FIND/COUNT/AGGREGATE), extracted entities, confidence score, and the raw MongoDB query/pipeline that was generated |
| `AnalyticsPanel.jsx` | **Live analytics** computed from `queryHistory` prop: total queries, avg response time, success rate, total results, unique collections queried, and a query-type distribution bar chart. No hardcoded data |
| `LoadingAnimation.jsx` | Animated loading state shown while queries are being processed |

### Chatbot Components (`components/chatbot/`)

| File | Description |
|------|-------------|
| `ChatbotWidget.jsx` | Floating action button (bottom-right) that toggles the chat window open/closed |
| `ChatWindow.jsx` | Chat interface with message history, text input, and send button. Communicates with the backend chatbot API (Gemini-powered or fallback) |
| `MessageBubble.jsx` | Individual chat message bubble. User messages aligned right, bot messages aligned left with different styling |

### UI Components (`components/ui/`)

| File | Description |
|------|-------------|
| `GlassCard.jsx` | Reusable card component with glassmorphism effect (`glass-card` class) — semi-transparent background, backdrop blur, subtle border glow |
| `Button.jsx` | Styled button with primary/secondary variants. Primary uses `glass-button-primary` with gradient text |
| `Input.jsx` | Styled text input with glass effect |
| `ToggleSwitch.jsx` | Toggle switch UI component |

### Three.js Components (`components/three/`)

| File | Description |
|------|-------------|
| `ParticleBackground.jsx` | Optional animated particle background using Three.js |
| `ShaderBackground.jsx` | Optional WebGL shader-based animated background |
| `SplineScene.jsx` | Optional 3D Spline scene integration |

> These are **optional** visual enhancement components. They are not currently imported in the landing page or dashboard.

### Hooks (`hooks/`)

| File | Description |
|------|-------------|
| `useScrollAnimation.js` | Intersection Observer hook that adds a CSS class when an element enters the viewport — used for scroll-triggered fade-in animations on all landing sections |
| `useChatbot.js` | State management hook for the chatbot: messages, loading state, sending messages via API |
| `useSound.js` | Optional sound effects hook |

### Styles (`styles/`)

| File | Description |
|------|-------------|
| `globals.css` | Global CSS reset, CSS custom properties (colors, typography, spacing), section layout, heading sizes (h1: 4.2rem, h2: 3rem), gradient-text class, responsive breakpoints |
| `glass.css` | Glassmorphism design system — `.glass-card`, `.glass-panel`, `.glass-button`, `.glass-navbar`, `.glass-sidebar`, `.glass-modal`, `.glass-badge`, `.glass-input`. White-tinted glass on black backgrounds with blur and inset glow |
| `theme.css` | Simplified theme file (entire app is dark-only, no light mode toggle needed) |

### Utilities (`utils/`)

| File | Description |
|------|-------------|
| `api.js` | HTTP client functions for all backend API calls: `translateQuery()`, `executeQuery()`, `sendChatMessage()`, `getCollections()`, `vectorSearch()`. Points to `http://localhost:5000/api` |
| `queryFormatter.js` | Utility to format MongoDB queries for display |

### Config Files

| File | Description |
|------|-------------|
| `jsconfig.json` | Path alias: `@/` maps to `./src/` for clean imports |
| `next.config.js` | Next.js config: React strict mode enabled |
| `package.json` | Dependencies: next, react, react-dom, lucide-react, react-hot-toast, three, @react-three/fiber, @react-three/drei, @use-gesture/react |
| `Dockerfile` | Multi-stage Docker build: install deps → build → serve with Next.js |

---

## Server (Backend)

The backend is an Express.js API that connects to MongoDB, handles query translation (via AI service or fallback), validates queries for security, and executes them.

### Entry Point

| File | Description |
|------|-------------|
| `server.js` | Express app setup: Helmet (security headers), CORS, rate limiting (100 req/15min), JSON parsing, Morgan logging, route mounting (`/api/query`, `/api/chatbot`), health check endpoint (`/api/health`), error handler. Starts server on PORT from `.env` (default 5000) |

### Config (`config/`)

| File | Description |
|------|-------------|
| `db.js` | MongoDB connection using Mongoose. Connects to `MONGO_URI` from `.env`. Handles connection events (error, disconnect). In development mode, server continues running even if MongoDB is unavailable |

### Routes (`routes/`)

| File | Description |
|------|-------------|
| `queryRoutes.js` | Query-related API routes: `POST /translate` (NL → MongoDB), `POST /execute` (raw query), `GET /collections` (list DB collections), `POST /vector-search` (semantic search), `GET /stats` (usage statistics). All mutation routes pass through `validateQueryInput` middleware |
| `chatbotRoutes.js` | Chatbot API route: `POST /message` for AI chat |

### Controllers (`controllers/`)

| File | Description |
|------|-------------|
| `queryController.js` | Main query logic. `translateAndExecute`: calls AI service for NL translation → validates generated query → executes against MongoDB (find, count, or aggregate based on intent) → returns results with metadata. `executeRawQuery`: executes a pre-built MongoDB query. `getCollections`: lists all collections in the database. `vectorSearch`: Atlas Vector Search using embeddings. `getStats`: returns usage statistics. **Includes mock data** for when MongoDB isn't connected |
| `chatbotController.js` | Handles chat messages by forwarding to the AI service chat endpoint |

### Middleware (`middleware/`)

| File | Description |
|------|-------------|
| `securityMiddleware.js` | **Input validation & sanitization.** `validateQueryInput`: sanitizes string inputs (removes control characters), blocks destructive natural language patterns (drop, delete all, destroy, truncate, wipe), validates collection names (alphanumeric only). `checkRole`: role-based access control (admin > analyst > viewer) |
| `errorHandler.js` | **Global error handler.** Catches and formats errors: Mongoose ValidationError (400), MongoDB duplicate key (409), CastError (400), rate limit (429), and generic 500. In development, includes error message; in production, hides details |

### Models (`models/`)

| File | Description |
|------|-------------|
| `User.js` | Mongoose schema for application users (not the queried data). Fields: `username`, `email`, `role` (admin/analyst/viewer), `permissions` (canExecuteQueries, canModifyData, canDeleteData, canViewAnalytics, maxQueriesPerHour), `queryHistory` (array of past queries with timestamps and execution times), `createdAt`, `lastActive`. Includes `canPerformAction` method for permission checking |

### Services (`services/`)

| File | Description |
|------|-------------|
| `aiService.js` | **Core AI translation engine.** `translateQuery`: calls the Python AI service at `http://localhost:8000/translate`. If unavailable, falls back to `fallbackTranslate` — a comprehensive regex-based NLP engine that detects intent (FIND/COUNT/AGGREGATE) and extracts entities for: salary, experience, role, department, status, name, email, skills, price, dates. Builds aggregation pipelines for group-by and average queries. `chat`: calls Gemini 2.0 Flash API for chatbot responses (with system prompt describing the database schema), falls back to keyword-matched responses. `getEmbedding`: calls AI service for text embeddings, falls back to random vectors |
| `queryValidator.js` | **Query security validator.** Checks generated MongoDB queries against destructive patterns (`$drop`, `deleteMany({})`, `dropDatabase`) and injection patterns (`$where`, `eval()`, `javascript:`, `process.exit`). Deep-validates nested query objects up to 10 levels. Blocks dangerous operators (`$accumulator`, `$function`). `sanitizeInput`: removes null bytes and control characters |
| `aggregationBuilder.js` | **MongoDB aggregation pipeline builder.** Builds pipelines from detected intent and entities: COUNT (with optional match → $count), AVERAGE ($group with $avg), SUM ($group with $sum), GROUP ($group with $count, sorted, limited to 20). `buildMatch`: converts field/operator/value entities into `$match` stage |

### Environment Variables (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://localhost:27017/querymindDB` | MongoDB connection string |
| `PORT` | `5000` | Backend server port |
| `AI_SERVICE_URL` | `http://localhost:8000` | Python AI service URL |
| `NODE_ENV` | `development` | Environment mode |
| `GEMINI_API_KEY` | — | Google Gemini API key for chatbot |

---

## AI Service (NLP Engine)

The AI service is an **optional** Python FastAPI application that provides advanced NLP capabilities. If not running, the Node.js backend uses its built-in fallback NLP — so the app works fully without Python.

### Entry Point

| File | Description |
|------|-------------|
| `app.py` | FastAPI app with endpoints: `POST /translate` (NL → MongoDB query), `POST /chat` (chatbot), `POST /embed` (text → vector embedding), `GET /health`. Uses lazy loading for NLP modules to optimize startup time |
| `requirements.txt` | Python dependencies: fastapi, uvicorn, spacy, sentence-transformers, pydantic, numpy |
| `Dockerfile` | Docker config for the AI service |

### NLP Modules (`nlp/`)

| File | Description |
|------|-------------|
| `__init__.py` | Package initializer |
| `intent_detection.py` | **Intent classifier.** Detects query type from natural language: FIND, COUNT, AGGREGATE, AVERAGE, SUM, GROUP, SORT, DISTINCT. Uses keyword matching and pattern analysis. Returns intent label and confidence score |
| `entity_extraction.py` | **Entity extractor.** Parses fields, values, operators, sort orders, and group-by clauses from natural language. Maps common words to MongoDB field names. Handles numeric values, string values, dates, and comparison operators |
| `query_generator.py` | **MongoDB query generator.** Takes the detected intent and extracted entities and generates either a `find()` query with filters or an aggregation `pipeline` (with $match, $group, $sort, $limit stages) |
| `embedding_engine.py` | **Text embedding engine.** Uses sentence-transformers to convert text into vector embeddings for semantic/vector search capabilities |

---

## API Endpoints

### Query API (`/api/query/`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/translate` | Translate natural language to MongoDB query and execute it | `{ query: string, collection: string }` |
| `POST` | `/execute` | Execute a raw MongoDB query | `{ query: object, collection: string }` |
| `GET` | `/collections` | List all MongoDB collections | — |
| `POST` | `/vector-search` | Semantic vector search | `{ query: string, collection: string, limit: number }` |
| `GET` | `/stats` | Get usage statistics | — |

### Chatbot API (`/api/chatbot/`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/message` | Send a chat message | `{ message: string, history: array }` |

### Health (`/api/health`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |

---

## Database Schema

The **queried data** (e.g., the `users` collection in MongoDB) uses this schema:

| Field | Type | Example Values |
|-------|------|----------------|
| `name` | String | "Arjun Kumar" |
| `email` | String | "arjun@example.com" |
| `role` | String | "student", "admin", "teacher" |
| `department` | String | "IT", "HR", "CS", "ECE" |
| `salary` | Number | 45000 |
| `status` | String | "active", "inactive" |
| `experience` | Number | 5 |
| `skills` | Array | ["JavaScript", "Python"] |
| `createdAt` | Date | 2024-01-15 |

---

## Security

QueryMindAI implements multiple security layers:

1. **Input Sanitization** — Removes control characters and null bytes from all inputs
2. **Destructive Operation Blocking** — Blocks natural language queries containing "drop database", "delete all", "destroy", "truncate", "wipe"
3. **Query Validation** — Scans generated MongoDB queries for dangerous patterns (`$drop`, `$where`, `eval()`, `javascript:`, `deleteMany({})`)
4. **Deep Validation** — Recursively checks nested query objects up to 10 levels for blocked operators (`$accumulator`, `$function`)
5. **Rate Limiting** — 100 requests per 15 minutes per IP via express-rate-limit
6. **Security Headers** — Helmet.js adds security headers (CSP, HSTS, X-Frame-Options, etc.)
7. **Collection Name Validation** — Only alphanumeric collection names are accepted
8. **Role-Based Access** — Admin > Analyst > Viewer permission hierarchy
9. **Result Limiting** — All queries are capped at 100 documents

---

## Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGO_URI=mongodb://localhost:27017/querymindDB
PORT=5000
AI_SERVICE_URL=http://localhost:8000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## License

MIT

---

**Built with ❤ by QueryMindAI**
