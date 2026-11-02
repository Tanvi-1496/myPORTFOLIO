# FastAPI Portfolio Backend

Production-quality, lightweight FastAPI backend for Tanvi's portfolio. Powers contact form delivery (with Resend and SMTP fallback), an AI portfolio assistant with strict knowledge grounding (Gemini / Anthropic), and aggregated live GitHub & LeetCode statistics with in-memory caching.

---

## Features

- **Health Check (`GET /api/health`)**: Liveness probe for hosting monitors.
- **Contact Form (`POST /api/contact`)**:
  - Pydantic v2 validation (name 2–80 chars, email validation, message 10–2000 chars).
  - Silent honeypot field (`website`) to defeat automated spam bots.
  - Primary delivery via Resend HTTP API (`reply_to` configured to visitor email).
  - Robust SMTP fallback (e.g. Gmail SMTP) when Resend is unconfigured.
  - Optional message persistence in Supabase PostgreSQL (`contact_messages` table).
  - IP rate limiting: 5 requests / hour.
  - Safe error masking (never exposes server internals or stack traces).
- **AI Chatbot (`POST /api/chat`)**:
  - Provider-agnostic LLM interface supporting Google Gemini (`gemini-2.5-flash`) and Anthropic Claude.
  - Strictly grounded system prompt from `knowledge.md` (no hallucinated dates, facts, or employers).
  - Prompt injection defenses and off-topic refusals.
  - 500-character input limit, capped output tokens, and memory bounded to the last 6 turns.
  - IP rate limiting: 20 requests / minute.
  - Always returns graceful HTTP 200 fallback answer with `showContactLink: true` if upstream LLM is unreachable.
- **Stats Aggregation (`GET /api/stats`)**:
  - Aggregates GitHub public repositories, stars on non-fork repos, top 5 languages, recent projects, and 1-year contribution graph.
  - Queries LeetCode solved counts (total, easy, medium, hard) via public GraphQL endpoint with fallback.
  - In-memory thread-safe 1-hour cache. Returns last cached data with `stale: true` flag if upstream APIs fail.
- **Production Guardrails**:
  - Strict CORS origin filtering.
  - Request body size limit (100 KB max).
  - Structured logging without leaking message content or secret keys.

---

## Quickstart (Local Development)

### 1. Prerequisites
- Python 3.11+ (Python 3.11, 3.12, 3.13, or 3.14)
- `pip`

### 2. Setup Virtual Environment

Navigate into the `backend/` directory:

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD):
.\venv\Scripts\activate.bat
# Linux / macOS:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your preferred settings:
- In local development, the backend will simulate email delivery and fallback smoothly even without API keys.
- To test the AI assistant with real LLM responses, set `LLM_API_KEY` with your Google Gemini key.

### 5. Run the Server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- **API Base**: `http://localhost:8000`
- **Swagger Documentation**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/api/health`

---

## Running Unit Tests

Run the test suite using `pytest`:

```bash
pytest -v
```

Tests cover:
- Health check verification
- Contact validation limits & honeypot spam suppression
- Chatbot graceful fallback & prompt constraints
- Stats caching & stale fallback handling

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `HOST` | Optional | `0.0.0.0` | Server host binding |
| `PORT` | Optional | `8000` | Server port binding (set automatically by Render) |
| `ALLOWED_ORIGINS` | Optional | `http://localhost:5173,...` | Comma-separated list of allowed frontend origins for CORS |
| `RESEND_API_KEY` | Optional | `""` | Resend API key (`re_...`) for sending contact emails |
| `CONTACT_TO_EMAIL` | Optional | `vibhavari.14092006@gmail.com` | Destination inbox for contact submissions |
| `CONTACT_FROM_EMAIL`| Optional | `onboarding@resend.dev` | Sender address verified in Resend |
| `SMTP_HOST` | Optional | `""` | Fallback SMTP host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | Optional | `587` | SMTP port (587 for TLS, 465 for SSL) |
| `SMTP_USER` | Optional | `""` | SMTP username |
| `SMTP_PASSWORD` | Optional | `""` | SMTP application password |
| `SMTP_FROM_EMAIL` | Optional | `""` | Sender email address for SMTP |
| `SUPABASE_URL` | Optional | `""` | Supabase project URL (`https://<project>.supabase.co`) |
| `SUPABASE_SERVICE_KEY` | Optional | `""` | Supabase service role key for inserting message records |
| `LLM_PROVIDER` | Optional | `gemini` | AI provider (`gemini` or `anthropic`) |
| `LLM_MODEL` | Optional | `gemini-2.5-flash` | Model ID (`gemini-2.5-flash`, `gemini-1.5-flash`, or `claude-3-5-haiku-latest`) |
| `LLM_API_KEY` | Optional | `""` | API key for Gemini or Anthropic |
| `GITHUB_TOKEN` | Optional | `""` | GitHub personal access token (boosts REST rate limits) |

---

## Supabase SQL Schema (Optional)

If `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are provided, submissions to `/api/contact` are stored in PostgreSQL.

Execute the following SQL in your Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow inserts via service role key
CREATE POLICY "Allow service role insert"
    ON contact_messages
    FOR INSERT
    TO service_role
    WITH CHECK (true);
```

---

## Deployment Guide

### Deploying the Backend on Render

1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository (`finalportfolio` or your fork).
4. Configure the service settings:
   - **Name**: `tanvi-portfolio-backend`
   - **Region**: Closest to your users (e.g., Oregon or Singapore)
   - **Branch**: `main`
   - **Root Directory**: `backend` *(Crucial: must be set to `backend`)*
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free tier
5. In the **Environment Variables** section, add:
   - `ALLOWED_ORIGINS`: `https://your-portfolio.vercel.app,http://localhost:5173` *(replace with your actual Vercel domain)*
   - `RESEND_API_KEY`: Your Resend API key
   - `CONTACT_TO_EMAIL`: `vibhavari.14092006@gmail.com`
   - `CONTACT_FROM_EMAIL`: Your verified sender (e.g. `Portfolio Contact <onboarding@resend.dev>`)
   - `LLM_PROVIDER`: `gemini`
   - `LLM_MODEL`: `gemini-2.5-flash`
   - `LLM_API_KEY`: Your Google AI Studio Gemini API key
   - `GITHUB_TOKEN`: *(Optional)* GitHub personal access token
6. Click **Deploy Web Service**.
7. Once deployed, copy your Render web service URL (e.g., `https://tanvi-portfolio-backend.onrender.com`).

*(Alternatively, use Render Blueprints by clicking "New +" → "Blueprint" and selecting `backend/render.yaml`)*.

---

### Deploying the Frontend on Vercel

1. In your [Vercel Dashboard](https://vercel.com/dashboard), open your portfolio project.
2. Go to **Settings** → **Environment Variables**.
3. Add a new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://tanvi-portfolio-backend.onrender.com` *(your Render backend URL, without trailing slash)*
   - **Environments**: Production, Preview, Development
4. Click **Save**.
5. Go to **Deployments** and trigger a **Redeploy** (or push a new commit) to bake the new environment variable into the Vite build.
6. Remember to ensure that your Vercel deployment URL (e.g., `https://tanvijaware.vercel.app`) is included in your Render backend's `ALLOWED_ORIGINS`.

---

## Safe Fallback Guarantee

If the backend is offline, spinning up from Render free-tier cold sleep, or if `VITE_API_URL` is omitted entirely:
- **Contact Form**: Gracefully prompts the visitor to email directly with a convenient `mailto:` link.
- **Chat Assistant**: Immediately falls back to client-side heuristic knowledge matching without throwing any UI errors.
- **GitHub Stats**: Seamlessly switches to direct browser API queries and static cached fallbacks.
