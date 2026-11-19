# Scholarship Knowledge Engine

A full-stack research application for exploring and evaluating knowledge bases built from Philippine scholarship policy documents (PM-USP CSSS).

## Research Context

This application supports a comparative study of **Competency Question (CQ)-guided** vs **ad hoc** knowledge base construction methods for the Commission on Higher Education's Cash-based Scholarship Support System (CSSS) under the **Pantawid ng Munisipyo para sa Unibersidad ng Pilipinas (PM-USP)** program.

**Research Hypothesis:** A CQ-guided knowledge base (20 rules) will achieve higher query accuracy and rule coverage than an ad hoc knowledge base (15 rules), because the CQs enforce complete coverage of scholarship policy dimensions.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI 0.115, Python 3.9+, Pydantic v2 |
| Frontend | React 18, TypeScript 5, Vite 5 |
| Styling | Tailwind CSS 3, Radix UI |
| Charts | Recharts 2 |
| Testing | pytest (backend), Vitest + Testing Library (frontend) |

## Directory Structure

```
Scholarship-Knowledge-Engine/
├── frontend/           # React + TypeScript + Vite app
│   ├── src/
│   │   ├── components/ # UI, layout, chart components
│   │   ├── pages/      # Route-level page components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── services/   # Axios API service layer
│   │   └── types/      # TypeScript type definitions
│   └── public/
├── backend/            # FastAPI application
│   ├── app/
│   │   ├── api/routes/ # API route handlers
│   │   ├── core/       # Configuration and utilities
│   │   ├── models/     # Pydantic data models
│   │   ├── repositories/ # Data access layer
│   │   └── services/   # Business logic
│   └── data/           # Static JSON data files
├── tests/
│   ├── backend/        # pytest test suite
│   └── frontend/       # Vitest test suite
├── start.ps1           # One-click startup script
└── README.md
```

## Quick Start

```powershell
.\start.ps1
```

This will:
1. Install backend Python dependencies
2. Install frontend Node dependencies
3. Run backend tests
4. Start the FastAPI server on **http://localhost:8000**
5. Start the Vite dev server on **http://localhost:5173**

## Manual Start

### Backend
```powershell
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend
```powershell
cd frontend
npm install
npm run dev
```

## Running Tests

### Backend Tests
```powershell
cd backend
python -m pytest ../tests/backend -v --tb=short
```

### Frontend Tests
```powershell
cd frontend
npm test
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/rules` | List all policy rules |
| GET | `/api/rules/{id}` | Get rule by ID |
| GET | `/api/competency-questions` | List competency questions |
| POST | `/api/query` | Submit a natural-language query |
| GET | `/api/evaluation/compare` | Compare CQ-guided vs Ad hoc metrics |
| GET | `/api/evaluation/results` | List all test query results |
| GET | `/api/test-queries` | List test queries |
| GET | `/api/dashboard/summary` | Dashboard summary stats |
| GET | `/api/sources` | List policy sources |
| GET | `/api/knowledge-bases` | Describe both knowledge bases |
| GET | `/api/export/test-results` | Download CSV of test results |

API documentation (Swagger UI): **http://localhost:8000/docs**

## Research Note

All policy rules are derived from real CSSS/PM-USP policy documents (MoE issuances and NSP guidelines). The evaluation metrics — query accuracy and rule coverage — directly reflect the actual knowledge base construction decisions made during the study. Data is not synthetic.
