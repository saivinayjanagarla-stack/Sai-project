# 🌿 EcoMetrics AI - Intelligent Sustainability & Decarbonization Platform

> **Theme**: AI for Sustainability  
> **Challenge**: Real-world commercial & community resource optimization, GHG Scope 1-3 accounting, automated energy anomaly detection, and AI-driven decarbonization roadmaps.

---

## 📋 Table of Contents
1. [Problem Statement](#-problem-statement)
2. [Solution Description](#-solution-description)
3. [Key Features](#-key-features)
4. [Architecture & Tech Stack](#-architecture--tech-stack)
5. [AI Integration & Google Gemini](#-ai-integration--google-gemini)
6. [Project Setup & Execution Steps](#-project-setup--execution-steps)
7. [Environment Variables](#-environment-variables)
8. [API Endpoints Specification](#-api-endpoints-specification)
9. [Deployment Guide](#-deployment-guide)

---

## 🎯 Problem Statement

Commercial facilities, university campuses, and urban communities account for over **40% of global greenhouse gas (GHG) emissions** and millions of kilowatt-hours in avoidable energy waste. 

Facility managers, sustainability directors, and city planners face critical hurdles:
- **Fragmented Resource Data**: Energy bills, water meters, waste streams, and corporate travel data are isolated in disparate spreadsheets.
- **Complexity of Scope 1, 2, & 3 Accounting**: Manually calculating carbon equivalents ($CO_2e$) under the GHG Protocol is prone to error and expensive.
- **Unidentified Energy Anomalies**: Equipment leaks or HVAC idle spikes during off-hours go unnoticed for months.
- **Lack of Actionable Insights**: Facilities struggle to convert raw energy numbers into prioritized, high-ROI green retrofit decisions.

---

## 💡 Solution Description

**EcoMetrics AI** is a full-stack, enterprise-grade AI Sustainability & Decarbonization Platform powered by **Google Gemini API**, **Vite + React**, **Node.js/Express**, and **SQLite**. 

EcoMetrics AI aggregates operational data across **Scope 1 (Direct Fuel)**, **Scope 2 (Grid Electricity)**, and **Scope 3 (Water, Waste, Transport, Supply Chain)**. It provides real-time interactive analytics, automated anomaly alerts, a **Net-Zero Retrofit Simulator**, audit-ready **ESG Reports**, and an interactive **Gemini Eco-Chat Assistant** to accelerate Parisian 1.5°C alignment.

---

## ✨ Key Features

1. **📊 Interactive Real-Time Command Center**:
   - Scope 1, 2, and 3 GHG breakdown in metric tonnes $CO_2e$.
   - Interactive Recharts visualization for monthly emission trajectories and resource distribution.
   - Renewable energy adoption share (%) & ESG compliance scoring.

2. **🤖 AI Decarbonization Advisor & Eco-Chat (Google Gemini)**:
   - **Custom Audit Generator**: Upload usage stats to receive instant, facility-tailored decarbonization plans, CapEx estimates, and ROI payback periods.
   - **Interactive Eco-Chat Assistant**: Context-aware AI assistant specialized in HVAC setbacks, solar PV feasibility, zero-waste initiatives, and ISO 50001 standards.

3. **🎛️ Net-Zero Retrofit Scenario Simulator**:
   - Interactive slider controls for Rooftop Solar PV (kW), Heat Pump Boilers (%), EV Fleets (%), Smart HVAC AI setbacks, and LED upgrades.
   - Live 2026–2030 projected emission trajectories, calculated project CapEx ($), annual utility OpEx savings ($), and payback timeline.

4. **📑 Audit-Ready ESG Compliance Reporting**:
   - Generate official environmental disclosures formatted for GHG Protocol Corporate Standard, CSRD, and GRI reporting.
   - Export reports as structured JSON payloads or print executive summaries.

5. **🏆 Community Eco-Leaderboard & Gamification**:
   - Engages occupants and employees to submit sustainable habits (Carpooling, Desk Solar Charging, Zero-Waste Lunches, Tree Planting).
   - Dynamic leaderboard awarding points and carbon credit badges.

6. **🔒 Secure Authentication & Data Integrity**:
   - JWT token-based authentication, bcrypt password hashing, and Zod schema validation.

---

## 🏗️ Architecture & Tech Stack

```
AI for Sustainability/
├── backend/
│   ├── src/
│   │   ├── config/          # SQLite database connection & initial data seeding
│   │   ├── controllers/     # Express logic for Auth, Emissions, AI, Simulator, Reports, Community
│   │   ├── middleware/      # JWT verification & Zod request validator
│   │   ├── routes/          # Express REST API routes
│   │   ├── services/        # Google Gemini AI service & fallback heuristics
│   │   └── app.js           # Main Express server entrypoint
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Sidebar, EmissionModal
│   │   ├── context/         # AuthContext provider
│   │   ├── pages/           # Dashboard, EmissionsTracker, AISustainabilityAdvisor, ScenarioSimulator, ESGReports, CommunityLeaderboard, Login, Register
│   │   ├── services/        # Axios API client
│   │   ├── App.jsx          # React Router v6
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

### Stack Components:
- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Recharts, Lucide React, Axios.
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Zod validation.
- **Database**: SQLite (via `sqlite` / `sqlite3`).
- **AI Integration**: Google Gemini API (`@google/generative-ai` SDK).

---

## 🧠 AI Integration & Google Gemini

The AI layer connects securely to the **Google Gemini API** (`gemini-1.5-flash` model).

- **Security Constraint**: The `GEMINI_API_KEY` is kept **strictly in backend environment variables** (`backend/.env`) and never exposed to client browsers.
- **Resilience Engine**: If an API key is not present during evaluation, the backend seamlessly routes queries through an engineered sustainability intelligence fallback, ensuring 100% feature availability.

---

## 🚀 Project Setup & Execution Steps

### Prerequisites:
- Node.js (v18.x or v20.x recommended)
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/ai-for-sustainability.git
cd ai-for-sustainability
```

### Step 2: Setup & Run Backend API Server
```bash
cd backend
npm install

# Create environment file (.env)
cp .env.example .env

# Start Backend Server (runs on http://localhost:5000)
npm run dev
```

### Step 3: Setup & Run Frontend Client
Open a new terminal window:
```bash
cd frontend
npm install

# Start Frontend Dev Server (runs on http://localhost:3000)
npm run dev
```

### Step 4: Open Application in Browser
Navigate to `http://localhost:3000`.

#### Demo Credentials for Instant Evaluation:
- **Sustainability Officer**:
  - Email: `admin@ecometrics.ai`
  - Password: `password123`
- **Facility Auditor**:
  - Email: `alex@greencorp.com`
  - Password: `password123`

---

## 🔑 Environment Variables

### Backend (`backend/.env`):
```env
PORT=5000
JWT_SECRET=ecometrics_super_secret_jwt_key_2026_sustainability
GEMINI_API_KEY=your_google_gemini_api_key_here
NODE_ENV=development
```

---

## 📡 API Endpoints Specification

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` — Create a new user account.
- `POST /api/auth/login` — Authenticate and receive JWT token.
- `GET /api/auth/profile` — Fetch currently logged-in user profile.

### Emissions Routes (`/api/emissions`)
- `GET /api/emissions/summary` — Get aggregated Scope 1-3 metrics, monthly trends, and alerts.
- `GET /api/emissions/logs` — List operational consumption logs.
- `POST /api/emissions/logs` — Add a new energy/water/waste log.
- `DELETE /api/emissions/logs/:id` — Delete a log record.

### AI Service Routes (`/api/ai`)
- `POST /api/ai/audit` — Generate Gemini-powered Decarbonization Strategy.
- `POST /api/ai/chat` — Send query to interactive Eco-Chat assistant.

### Scenario Simulator Routes (`/api/simulator`)
- `POST /api/simulator/run` — Run green retrofit simulation calculations & trajectory forecast.

### ESG Reports Routes (`/api/reports`)
- `GET /api/reports` — Fetch list of compiled ESG reports.
- `POST /api/reports` — Compile and save a new GHG Protocol ESG report.

### Community Routes (`/api/community`)
- `GET /api/community` — Fetch community activity feed and leaderboard rankings.
- `POST /api/community` — Log a green eco-action and earn points.

---

## ☁️ Deployment Guide

### 1. Frontend (Vercel / Netlify)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_BASE_URL`: Production URL of Render backend.

### 2. Backend (Render / Railway / Fly.io)
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node src/app.js`
- Environment Variables:
  - `PORT`: `5000`
  - `JWT_SECRET`: (Random 32+ character string)
  - `GEMINI_API_KEY`: Google Gemini API key from Google AI Studio.

### 3. Database (SQLite / Supabase / Neon PostgreSQL)
- Out-of-the-box, the app runs zero-config SQLite.
- For production cloud database deployment, set connection parameters in `backend/src/config/db.js` for Supabase or PostgreSQL.

---

### 💚 Built for the AI for Sustainability Hackathon Challenge
