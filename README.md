# AI Career Studio - Backend API

Production-ready Node.js, Express, TypeScript, and Prisma backend for **AI Career Studio** (Job-Search Workspace for Indian Job Seekers).

---

## Tech Stack & Architecture
- **Runtime & Language**: Node.js + Express (ES Modules) + TypeScript
- **Database & ORM**: MongoDB Atlas with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens, 7-day expiry) with bcrypt password hashing (10 salt rounds)
- **Validation**: Zod schema middleware for request body, query, and params
- **Security**: Helmet, CORS (allowing `http://localhost:5173` and `http://localhost:5174`), strict rate limiting for auth endpoints
- **AI & Analysis**: LLM integration (Anthropic Claude / Gemini / OpenAI) with intelligent rule-based heuristic fallback
- **File Parsing**: Multer memory storage (5MB max) + `pdf-parse` + `mammoth` (DOCX)
- **Testing**: Vitest + Supertest

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key configuration variables:
- `PORT`: Set to `5000` (matches frontend default `VITE_API_URL=http://localhost:5000`).
- `DATABASE_URL`: MongoDB Atlas connection string.
- `JWT_SECRET`: Secure string of at least 32 characters.
- `ANTHROPIC_API_KEY` / `GEMINI_API_KEY` / `OPENAI_API_KEY`: Optional; an intelligent heuristic fallback analyzer is active if omitted.

### 3. Initialize Database & Seed Jobs
Push database schema and run seed script:
```bash
npm run db:push
npm run seed
```
This populates:
- 25+ realistic Indian tech jobs across Bengaluru, Hyderabad, Pune, Mumbai, Delhi NCR, Chennai, and Remote (India).
- Default demo user: `tanveer.alam@example.com` / `Password123!`.
- Tracked pipeline applications and bookmarks.

### 4. Run Development Server
```bash
npm run dev
```
Server runs on `http://localhost:5000`.

### 5. Run Test Suite & Build
```bash
npm test
npm run build
```

---

## API Endpoints Reference

### A. Health Check
- `GET /health` or `GET /api/health` -> `{ status: "ok", timestamp: "..." }`

### B. User & Authentication
- `POST /api/auth/register` (or `/signup`) -> `{ name, email, password }`
- `POST /api/auth/login` -> `{ email, password }`
  - Returns `{ token, user: { id, name, email, title, location, avatar }, profile }`
- `GET /api/auth/me` -> Current authenticated user and profile (`Authorization: Bearer <token>`)

### C. Jobs & Bookmarks
- `GET /api/jobs`: Query params: `q`, `role`, `location`, `min_salary`, `experience`, `job_type`, `page`, `limit`
- `GET /api/jobs/recommended`: Ranked jobs ordered by server-side match score with user skills
- `GET /api/jobs/saved`: List of bookmarked job IDs (authenticated)
- `GET /api/jobs/:id`: Fetch single job details
- `POST /api/jobs`: Create new job
- `POST /api/jobs/:id/save`: Save/bookmark job
- `DELETE /api/jobs/:id/save`: Remove from bookmarks

### D. Applications Pipeline (Kanban Tracker)
- `GET /api/applications`: Get all tracked applications for authenticated user
- `POST /api/applications`: Track job application (`{ jobId, stage: 'applied' | 'saved', notes?, interviewDate? }`)
- `PUT /api/applications/:id`: Update stage (`saved` | `applied` | `interview` | `offer` | `rejected`), notes, or interview date
- `DELETE /api/applications/:id`: Remove application from tracking

### E. AI Resume Analysis
- `POST /api/resume/analyze`:
  - Accepts JSON payload: `{ resumeText: string, fileName?: string }`
  - OR multipart/form-data with file field `file` (`.pdf`, `.docx`, `.txt`)
  - Returns strict JSON schema:
    - `id`, `analyzedAt`, `fileName`
    - `overallScore`, `sectionScores: { impact, skills, formatting, experience }`
    - `strengths[]`, `weaknesses[]`, `suggestions[]`
    - `missingSkills[]`, `matchedSkills[]`
    - `extractedWordCount`, `detectedRoleTarget`

### F. Mock Interview & Evaluation
- `GET /api/interviews/questions?role=Frontend+Engineering`: Curated technical and architectural interview questions
- `POST /api/interviews/evaluate`:
  - Evaluates candidate answer using the STAR methodology (Situation, Task, Action, Result)
  - Returns individual scores, structured feedback, and sample optimal answers
