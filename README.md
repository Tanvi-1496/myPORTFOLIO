# Tanvi's Portfolio Website

Modern, high-performance developer portfolio built with React 19, TypeScript, Tailwind CSS v4, and Motion, powered by a production-ready FastAPI backend for secure contact messaging, AI chat assistance, and live GitHub / LeetCode metrics.

- **Frontend**: React 19, Vite, Tailwind CSS v4, Motion, Lucide Icons (deployed on Vercel).
- **Backend**: Python 3.11+, FastAPI, Uvicorn, SlowAPI rate-limiting, Pydantic v2, HTTPX (deployed on Render).

---

## Architecture Overview

```
finalportfolio/
├── src/                  # React 19 + TypeScript frontend
│   ├── components/       # UI sections (Hero, About, Projects, Contact, ChatWidget, GithubStats)
│   ├── lib/api.ts        # Typed API client with 8s timeouts and safe fallbacks
│   └── data/             # Profile data, journey, and projects
├── backend/              # FastAPI production backend
│   ├── app/              # Main app, routers (contact, chat, stats), services (email, llm, cache)
│   ├── tests/            # Automated Pytest suite
│   ├── knowledge.md      # Grounded facts for the AI assistant
│   └── render.yaml       # Render web service blueprint
├── .env.example          # Frontend Vite environment template
└── package.json          # Node.js dependencies and scripts
```

---

## Safe Fallback Guarantee

The portfolio is architected with **zero single point of failure**:
- If the backend is spinning up or offline, the site seamlessly falls back to client-side heuristics, direct API queries, and `mailto:` contact links.
- If `VITE_API_URL` is omitted, the portfolio operates cleanly in standalone demo mode.

---

## Local Development

### 1. Frontend
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```

### 2. Backend
See detailed instructions in [backend/README.md](file:///c:/Users/hp/Desktop/projects/finalportfolio/backend/README.md).
```bash
cd backend
python -m venv venv
# Activate venv, then:
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## Deployment

- **Frontend**: Deploy on [Vercel](https://vercel.com) (set `VITE_API_URL` to your Render backend URL).
- **Backend**: Deploy on [Render](https://render.com) using `backend/render.yaml` or a Web Service with root directory `backend`.
