# SEO Analysis & Execution Bot

## Project Overview
A production-grade, full-stack SEO analysis system that automates the transition from website audit to content execution. It crawls websites, analyzes SERP data, generates 15 prioritized AI recommendations, and provides an ethical "Bot Layer" that drafts content for human approval.

## Problem Statement
Small businesses and marketing teams often struggle to turn raw SEO data into actionable tasks. This bot solves the "analysis paralysis" by providing a structured roadmap and ready-to-use content drafts, ensuring that SEO strategies are actually executed.

## Development Phases

| Phase | Milestone | Features |
|-------|-----------|----------|
| **Phase 1** | Foundation | Scaffolding, Prisma (PostgreSQL), BullMQ (Redis), Global Middleware |
| **Phase 2** | Crawler | Cheerio-based Scraping, SerpAPI Integration, Caching Layer |
| **Phase 3** | AI Analysis | LLM Intelligence for Keywords, Competitor Gaps, and Tech Audit |
| **Phase 4** | Engine | 15 Prioritized Recommendations with Impact/Effort metrics |
| **Phase 5** | Bot Layer | 6 Content Types, Ethical State Machine (Draft -> Approved) |
| **Phase 6** | API & Ops | Unified Reports API, Swagger Docs, Dockerization |
| **Phase 7** | Frontend | React + TS Dashboard, TanStack Query, Live Pipeline Tracking |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React (Vite), TypeScript, Tailwind CSS, TanStack Query, Recharts, Lucide |
| **Backend** | Node.js, Express.js, Zod |
| **Database** | PostgreSQL (Prisma ORM) |
| **Cache / Queue** | Redis, BullMQ |
| **AI / LLM** | Anthropic Claude 3.5 Sonnet |
| **Search Data** | SerpAPI |
| **Web Scraping** | Cheerio |
| **Documentation** | Swagger JSDoc / UI |
| **Containerization** | Docker, Docker Compose, Nginx |

## Setup Instructions

### Prerequisites
- Node.js v20+
- Docker + Docker Compose
- SerpAPI Key
- Anthropic API Key

### Quick Start (Full Stack Docker)
```bash
cp .env.example .env
# Fill in SERP_API_KEY, ANTHROPIC_API_KEY, and DATABASE_URL
docker compose up --build
```
Access the dashboard at: `http://localhost:5173`

### Local Development

# From the root directory
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

**2. Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Feature Breakdown

### 1. Live Pipeline Tracking
Track the SEO audit in real-time as the system moves through Crawling, Searching, Keyword Analysis, Competitor Mapping, and Roadmap Generation.

### 2. Deep SEO Reports
- **Technical Health**: Grade-based scoring (A-F) with detailed issue logs.
- **Keyword Intel**: Primary, secondary, and long-tail opportunities with search intent mapping.
- **Competitor Gaps**: Visualized comparison of content themes and SEO scores.
- **Backlink Strategy**: Impact-focused outreach opportunities.

### 3. Execution Assistant (The Bot Layer)
- **Ethical Content Generation**: Automatically drafts Blogs, Social Posts, Outreach Emails, and Forum responses.
- **Review Workflow**: Edit, Regenerate, Approve, or Reject drafts.
- **Safety First**: Human-in-the-loop requirement; content is drafted for you but requires manual execution to prevent spam.

## API Documentation
Full Swagger docs available at: `http://localhost:3000/api/docs`

## Ethical Boundaries
- ✅ Generates drafts for human review.
- ✅ Requires explicit approval per item.
- ❌ Never auto-posts to any platform.
- ❌ Never mass-comments or spams.

## Deployment
- **Dashboard**: `http://localhost:5173`
- **Backend API**: `http://localhost:3000`
- **API Docs**: `http://localhost:3000/api/docs`
- **Health Check**: `http://localhost:3000/api/v1/health/detailed`
