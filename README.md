# Apex Elite: SEO Intelligence & Execution Engine 🚀

![Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen)
![Tech](https://img.shields.io/badge/Tech-Full--Stack--AI-blue)
![Ethical](https://img.shields.io/badge/Ethical-Human--in--the--Loop-orange)

## 1. Project Overview
**Apex Elite** is a state-of-the-art SEO Analysis and Automated Execution platform. It transforms raw organizational data into a high-fidelity strategic roadmap, powered by a **Neural Heuristic Engine**. Unlike passive audit tools, Apex Elite features a mandatory **SEO Execution Assistant (Bot Layer)** that bridges the gap between insight and action by architecting ready-to-use content assets under strict human supervision.

### Key Features
- **Neural Audit Pipeline**: Parallel processing of Keywords, Technical SEO, Competitors, and Backlinks.
- **Heuristic Resilience**: Fallback logic ensures functionality even during AI rate limits.
- **Execution Command Center**: Generates blog ideas, social posts, and outreach emails.
- **Ethical Bot Layer**: Enforces "Human-in-the-Loop" safety—no blind automation or spam.
- **Obsidian Dark UI**: A premium, motion-enhanced dashboard for high-density data visualization.

---

## 2. Problem Statement
Traditional SEO tools often leave users with a "wall of data" but no clear path to execution. This "Analysis Paralysis" prevents businesses from acting on critical insights. 

**Apex Elite solves this by:**
1. **Converting Data to Content**: The Bot Layer takes a "Technical Audit" and turns it into a "Social Media Post" or "Blog Draft" in seconds.
2. **Eliminating Manual Research**: Automated SERP scraping and AI synthesis replace hours of manual competitor auditing.
3. **Enforcing Ethical Growth**: By requiring human confirmation for every action, it ensures compliance with platform TOS and prevents low-quality spam.

---

## 3. Tech Stack
| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, TanStack Query |
| **Backend** | Node.js (ESM), Express.js, Prisma ORM |
| **Database** | PostgreSQL (Prisma Postgres / Cloud) |
| **Intelligence** | Groq API (LLM Inference), SerpAPI (Search Connectivity) |
| **Infrastructure** | BullMQ (Job Queues), Redis (Shared State), Zod (Validation) |
| **Deployment** | Render (Backend), Netlify (Frontend) |

---

## 4. Setup Instructions

### Backend Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/praveen-86176/SEO-Bot.git
   cd "SEO Bot"
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**: Create a `.env` file in the root (see section 5).
4. **Prisma Initialization**:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```
5. **Run Server**:
   ```bash
   npm start
   ```

### Frontend Setup
1. **Navigate to frontend**:
   ```bash
   cd frontend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**: Create a `frontend/.env` with `VITE_API_URL`.
4. **Run Locally**:
   ```bash
   npm run dev
   ```

---

## 5. Environment Variables
### Backend (`.env`)
| Variable | Purpose |
| :--- | :--- |
| `DATABASE_URL` | Connection string for the PostgreSQL memory module. |
| `REDIS_URL` | Connection string for the BullMQ background worker. |
| `GROQ_API_KEY` | Credentials for the LLM Neural Engine (Inference). |
| `SERP_API_KEY` | API key for internet data fetching (Google Search). |
| `CORS_ORIGIN` | Allowed frontend origin (e.g., your Netlify URL). |

---

## 6. Project Flow
1. **Ingestion**: User submits Organization Name, URL, and Industry via the "Elite Ingestion" form.
2. **Internet Discovery**: The system pings the URL to extract Meta Tags, Headings, and Performance metrics.
3. **Neural Analysis**: BullMQ triggers a background worker that runs 4 parallel modules:
   - *Keywords*: Intent-based classification.
   - *Technical*: Structure and performance audit.
   - *Competitors*: Threat level and gap analysis.
   - *Backlinks*: Opportunity mapping.
4. **Synthesis**: The Recommendation Engine generates a tactical roadmap.
5. **Activation**: The **Bot Layer** populates the Execution Assistant with ready-to-deploy content assets.

---

## 7. Feature Breakdown

### SEO Analysis & Recommendation Engine
The system uses a **Neural Heuristic Approach**. If the AI is rate-limited, the `seo.service.js` switches to baseline heuristics (calculating scores from raw crawl data) to ensure zero downtime. Recommendations are weighted by "Impact" and "Effort."

### Competitor & Backlink Logic
Analyzes the top-ranking results for your keywords and identifies "Content Gaps"—topics your competitors cover that you don't.

### Execution Assistant (Bot Layer)
This layer uses **Prompt Engineering** to architect platform-specific content:
- **Social Posts**: Optimized for engagement with hashtags.
- **Blog Ideas**: Structured with "Why this works" reasoning.
- **Emails**: Personalized outreach templates for backlink acquisition.

---

## 8. API Documentation

### Organization & Reports
- `POST /api/v1/organizations`: Ingests organization details and triggers the analysis.
- `GET /api/v1/reports/:id`: Fetches the full multi-dimensional SEO report.
- `GET /api/v1/reports/:id/status`: Lightweight heartbeat for analysis progress.

### Execution Layer
- `GET /api/v1/bot/stats/:reportId`: Fetches total execution items and approval rates.
- `POST /api/v1/bot/:reportId/execute/:recId`: Triggers the AI content architect for a specific recommendation.

---

## 9. Assumptions & Limitations
- **Mock Search**: If SerpAPI is not configured, the system uses "Heuristic Discovery" based on the primary URL.
- **Rate Limits**: The system is tuned for 1000 RPM but external LLM APIs may throttle high-frequency requests.
- **Crawl Restrictions**: Highly protected sites (e.g., Amazon) may block the baseline scraper.

---

## 10. Deployment
- **Frontend URL**: [Pending Deployment]
- **Backend URL**: [https://seo-bot-1.onrender.com](https://seo-bot-1.onrender.com)

---

## 11. Challenges & Future Improvements
- **Challenge**: Resolving the "99% analysis stall." **Solution**: Refactored sequential DB inserts into batch `prisma.createMany` operations.
- **Future**: Integration with Google Search Console for real-time ranking tracking and a "One-Click Deploy" to WordPress via REST API.

---
*Developed by Praveen Kumar | 2026 Assessment Submission*
