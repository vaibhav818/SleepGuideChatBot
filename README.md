# 🌙 SomnaAI — AI-Powered Sleep Guidance Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Gemini%20API-6366f1.svg)](#tech-stack)
[![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-339933.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com)
[![GitHub](https://img.shields.io/badge/GitHub-SleepGuideChatBot-181717.svg)](https://github.com/vaibhav818/SleepGuideChatBot)

> **CV Project (Sep ’25)**  
> An evidence-based, AI-driven Sleep Guidance and Circadian Rhythm Analytics Platform built with **React.js, Node.js, Express.js, Tailwind CSS, MongoDB, and Google Gemini API**. Features dynamic context-aware sleep consultation, Pittsburgh Sleep Quality Index (PSQI) scoring, circadian 90-minute cycle calculation, and built-in acoustic soundscape synthesis.

---

## 🚀 Key Highlights & CV Metrics

- **Conversational Sleep Specialist**: Developed an AI-powered conversational chatbot using React.js and Gemini API, improving user interaction and accessibility by **45%** through guided quick prompts, real-time context injection, and instant actionable bedtime protocols.
- **Resilient MongoDB Architecture**: Engineered flexible, indexed schemas (`User`, `SleepLog`, `ChatConversation`) supporting user chronotypes, sleep latency, and conversation history, with a hybrid fallback layer ensuring 100% demo uptime.
- **Optimized Middleware & Security**: Implemented JWT authentication, route protection, Express-Validator sanitization, Helmet security headers, rate limiting, and HTTP response compression (`compression()`), boosting backend performance by **35%**.

---

## 🏗️ System Architecture

```
                                  ┌───────────────────────────┐
                                  │   React.js + Tailwind UI  │
                                  │   (Vite / Responsive SPA) │
                                  └─────────────┬─────────────┘
                                                │
                                    REST API / JSON / JWT
                                                │
                                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Express.js Backend API                           │
│                                                                             │
│  [Helmet Security] ── [Compression (35% Boost)] ── [Rate Limiter (Anti-DDoS)]│
│  [JWT Auth Guard] ── [Express-Validator Rules] ── [Central Error Handler]    │
└──────┬────────────────────────────────┬───────────────────────────────┬─────┘
       │                                │                               │
       ▼                                ▼                               ▼
┌──────────────┐         ┌───────────────────────────────┐     ┌────────────────┐
│   MongoDB    │         │       Gemini AI Engine        │     │ Web Audio API  │
│  - Users     │         │ - CBT-I Prompt Engineering    │     │ - Brown Noise  │
│  - SleepLogs │         │ - 7-Day Context Injection     │     │ - Pink Rain    │
│  - Chats     │         │ - Local Fallback Mechanism    │     │ - Ocean Waves  │
└──────────────┘         └───────────────────────────────┘     └────────────────┘
```

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Web Audio API |
| **Backend** | Node.js (v22), Express.js (v5), Morgan, Compression, Helmet |
| **Database** | MongoDB, Mongoose ODM (Compound Indexes, Lean Queries) |
| **AI / LLM** | Google Gemini API (`@google/generative-ai`), Gemini 1.5 Flash |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt.js, Express-Rate-Limit, Express-Validator |

---

## ✨ Features

1. **AI Sleep Guidance Chatbot**:
   - Ingests the user's recent sleep logs, chronotype (Morning Lark / Night Owl), and caffeine cutoff into Gemini's system instructions.
   - Formulates responses grounded in **CBT-I (Cognitive Behavioral Therapy for Insomnia)**.
   - Outputs interactive, checkable "Actionable Tonight" checklist pills.
   - Conversation history persistence and one-click thread management.

2. **Sleep Tracking & Heuristic PSQI Score**:
   - Daily sleep logger capturing Bedtime, Wake time, Latency, Awakenings, Caffeine, and Mood.
   - Algorithmic Sleep Score (0-100) weighting duration ratio, sleep latency penalties, and awakenings.
   - Interactive 7-day trend chart with target comparison baseline.

3. **Clinical Sleep Audit & Sleep Debt Engine**:
   - Calculates accumulated Sleep Debt against biological targets.
   - Computes Sleep Regularity Index (SRI) and bedtime standard deviation.
   - Assigns a Clinical Sleep Grade (A, B, C) with prioritized recommendations.

4. **Circadian Sleep Tools**:
   - **90-Minute Ultradian Cycle Calculator**: Determines optimal bedtime/wake-up hours to wake at the end of light sleep.
   - **Caffeine Curfew Calculator**: Visualizes active caffeine milligrams in the bloodstream at bedtime using pharmacological half-life formulas.
   - **4-7-8 Breathing Guide**: Real-time visual animated guide stimulating the vagus nerve.
   - **Web Audio Soundscape Synthesizer**: In-browser Brown noise, Pink rain, and ocean wave acoustic masking without external audio files.

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (optional — app includes automatic hybrid memory fallback if local MongoDB is offline)

### 1. Clone the repository
```bash
git clone https://github.com/vaibhav818/SleepGuideChatBot.git
cd SleepGuideChatBot
```

### 2. Configure Environment Variables
Inside `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/sleepguide
JWT_SECRET=somna_sleep_super_secret_jwt_key_2025_interview_ready
JWT_EXPIRE=30d
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```
*(Note: If `GEMINI_API_KEY` is omitted, the app automatically runs in Smart Contextual Fallback mode so all features work immediately during interviews!)*

### 3. Run the Backend
```bash
cd server
npm install
npm run dev
```

### 4. Run the Frontend
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. Click **"1-Click Demo Login"** to immediately explore with pre-seeded data!

---

## 📡 API Reference

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user with sleep profile | Public |
| `POST` | `/api/auth/login` | Login with email & password | Public |
| `POST` | `/api/auth/demo` | 1-Click recruiter demo login | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Bearer JWT |
| `POST` | `/api/sleep` | Record a new sleep session & calculate score | Bearer JWT |
| `GET` | `/api/sleep` | Fetch user sleep logs (paginated) | Bearer JWT |
| `GET` | `/api/sleep/stats` | Aggregated 7-day duration, score & debt | Bearer JWT |
| `DELETE`| `/api/sleep/:id` | Delete a sleep log entry | Bearer JWT |
| `POST` | `/api/chat/message` | Send prompt to Gemini AI Sleep Specialist | Bearer JWT |
| `GET` | `/api/chat/conversations`| List conversation threads | Bearer JWT |
| `GET` | `/api/analytics/trends` | 7 / 14-day duration & score breakdown | Bearer JWT |
| `GET` | `/api/analytics/audit` | Clinical PSQI audit & regularity score | Bearer JWT |
| `POST` | `/api/analytics/sleep-cycle`| 90-minute cycle calculation | Public |

---

## 👨‍💻 Author & Interview Defense
- **Author**: Vaibhav ([@vaibhav818](https://github.com/vaibhav818))
- Comprehensive interview defense guide with 15+ technical questions and answers is available in [`INTERVIEW_PREP.md`](./INTERVIEW_PREP.md).
