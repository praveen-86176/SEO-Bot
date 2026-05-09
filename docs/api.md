# Apex Elite: API Intelligence Nexus 🛠️

This document provides granular technical specifications for the Apex Elite SEO Bot API.

## Base URL
- **Production**: `https://seo-bot-1.onrender.com/api/v1`
- **Development**: `http://localhost:3000/api/v1`

---

## 1. Organizations & Ingestion

### Create Organization & Start Analysis
- **Route**: `/organizations`
- **Method**: `POST`
- **Purpose**: Registers a new organization and queues a background SEO audit.
- **Request Body**:
```json
{
  "name": "Quantum Dynamics",
  "website": "https://example.com",
  "industry": "Technology",
  "target_audience": "Enterprise SaaS",
  "services": ["Cloud Infrastructure", "Neural AI"],
  "competitors": ["https://rival.com"],
  "current_keywords": ["cloud security"]
}
```
- **Response Body (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-v4-string",
    "reportId": "uuid-v4-string",
    "status": "PENDING"
  }
}
```

---

## 2. SEO Intelligence Reports

### Get Full Audit Report
- **Route**: `/reports/:id`
- **Method**: `GET`
- **Purpose**: Fetches the multi-dimensional analysis including keywords, technicals, and recommendations.
- **Response Body (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "report-id",
    "organization": { ... },
    "raw_crawl_data": {
      "analysis": {
        "technical": { "score": 85, "grade": "A", "issues": [...] },
        "keywords": { "primary_keywords": [...], "summary": "..." }
      }
    },
    "recommendations": [...]
  }
}
```

### Get Analysis Status (Heartbeat)
- **Route**: `/reports/:id/status`
- **Method**: `GET`
- **Purpose**: Polling endpoint for real-time analysis progress.
- **Response Body (200 OK)**:
```json
{
  "success": true,
  "data": {
    "status": "PROCESSING",
    "progress": 65,
    "phase": "Neural Synthesis",
    "message": "Generating content roadmaps..."
  }
}
```

---

## 3. SEO Execution Assistant (Bot Layer)

### Execute Strategic Recommendation
- **Route**: `/bot/:reportId/execute/:recId`
- **Method**: `POST`
- **Purpose**: Triggers the AI Content Architect to generate tactical assets for a recommendation.
- **Response Body (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "type": "SOCIAL_POST",
      "content": "Optimized post content...",
      "hashtags": ["#seo", "#growth"]
    },
    {
      "type": "BLOG_POST_IDEA",
      "content": "High-intent article draft..."
    }
  ]
}
```

### Get Bot Statistics
- **Route**: `/bot/stats/:reportId`
- **Method**: `GET`
- **Purpose**: Aggregates execution performance and approval metrics.
- **Response Body (200 OK)**:
```json
{
  "success": true,
  "data": {
    "total": 12,
    "readyToExecute": 5,
    "approvalRate": 0.85
  }
}
```

---

## 4. Health & Monitoring

### Global Health Check
- **Route**: `/health`
- **Method**: `GET`
- **Response**: `{"status": "ok", "environment": "production"}`

### Detailed Infrastructure Audit
- **Route**: `/api/v1/health/detailed`
- **Method**: `GET`
- **Purpose**: Verifies internal connectivity to Postgres and Redis.
- **Response (200 OK / 207 Degraded)**:
```json
{
  "status": "ok",
  "services": {
    "database": { "status": "ok", "latencyMs": 5 },
    "redis": { "status": "ok", "latencyMs": 1 },
    "llm": { "status": "configured" }
  }
}
```
