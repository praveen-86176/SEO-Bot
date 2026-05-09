# SEO Bot API Reference

## Base URL
`http://localhost:3000/api/v1`

## Authentication
Currently no authentication required (recommended for production).

---

## 1. Organizations
Manage company information and trigger analysis.

### POST /organizations
**Purpose:** Create organization and queue full SEO analysis pipeline.
**Request Body:**
```json
{
  "name": "FitLife India",
  "website": "https://fitlifeindia.com",
  "industry": "Fitness & Wellness",
  "target_audience": "Urban professionals",
  "services": ["Personal Training"],
  "competitors": ["https://competitor.com"],
  "current_keywords": ["fitness trainer"]
}
```
**Response (202):**
```json
{ "success": true, "data": { "orgId": "...", "reportId": "..." } }
```

### GET /organizations/:id
**Purpose:** Get organization details.

---

## 2. Crawler
Monitor search and scrape progress.

### GET /crawler/progress/:reportId
**Purpose:** Get real-time status of the analysis pipeline.
**Response:**
```json
{ "status": "active", "progress": 66, "phase": "analyzing" }
```

---

## 3. SEO Analysis
Access raw AI analysis data.

### GET /seo/analysis/:reportId
**Purpose:** Get keywords, competitors, and technical audit data.

---

## 4. Recommendations
Actionable SEO advice.

### GET /recommendations/:reportId
**Purpose:** Paginated list of 15 prioritized recommendations.

---

## 5. Bot Layer (Execution Assistant)
Content generation and approval workflow.

### POST /bot/generate/:reportId
**Purpose:** Generate all content drafts for a report.

### GET /bot/plan/:reportId
**Purpose:** View all drafts grouped by recommendation.

### POST /bot/content/:id/approve
**Purpose:** Approve a draft for manual posting.

---

## 6. Reports
Unified data access.

### GET /reports/:reportId
**Purpose:** Comprehensive aggregated SEO report.

### GET /reports/:reportId/summary
**Purpose:** Dashboard-friendly summary.
