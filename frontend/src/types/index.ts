export interface Organization {
  id: string
  name: string
  website: string
  industry: string
  target_audience: string
  geography?: string
  services: string[]
  competitors?: string[]
  current_keywords?: string[]
  created_at: string
}

export interface CreateOrgPayload {
  name: string
  website: string
  industry: string
  target_audience: string
  geography?: string
  services: string[]
  competitors?: string[]
  current_keywords?: string[]
}

export interface SeoReport {
  id: string
  status: 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED'
  jobId?: string
  createdAt: string
  completedAt?: string
}

export interface ReportStatus {
  reportId: string
  status: string
  progress: number
  phase: string
  message: string
  organization?: {
    name: string
    website: string
  }
  createdAt: string
  completedAt?: string
}

export interface TechnicalAudit {
  score: number
  grade: string
  breakdown: Record<string, {
    score: number
    max: number
    checks: Record<string, boolean>
  }>
  issues: Array<{
    check: string
    severity: 'critical' | 'warning' | 'info'
    message: string
    recommendation: string
  }>
  passed: string[]
}

export interface KeywordAnalysis {
  primary_keywords: Array<{
    keyword: string
    search_intent: string
    difficulty: string
    relevance_score: number
    reasoning: string
  }>
  secondary_keywords: Array<{
    keyword: string
    search_intent: string
    relevance_score: number
  }>
  longtail_keywords: Array<{
    keyword: string
    search_intent: string
    why_valuable: string
  }>
  keyword_gaps: string[]
  seasonal_keywords: string[]
  summary: string
}

export interface Competitor {
  url: string
  strengths: string[]
  weaknesses: string[]
  estimated_keyword_focus: string[]
  content_themes: string[]
  seo_score_estimate: number
  threat_level?: 'low' | 'medium' | 'high'
}

export interface CompetitorAnalysis {
  competitors: Competitor[]
  content_gaps: string[]
  keyword_opportunities: string[]
  positioning_recommendations: string[]
  competitive_advantage: string
  threat_level: 'low' | 'medium' | 'high'
}

export interface BacklinkOpportunity {
  type: string
  platform: string
  platform_url: string
  relevance_score: number
  difficulty: 'easy' | 'medium' | 'hard'
  estimated_impact: 'low' | 'medium' | 'high'
  approach: string
  contact_strategy: string
}

export interface BacklinkStrategy {
  opportunities: BacklinkOpportunity[]
  quick_wins: string[]
  long_term_strategy: string
  anchor_text_suggestions: string[]
}

export interface Recommendation {
  id: string
  category: 'KEYWORD' | 'CONTENT' | 'BACKLINK' | 'TECHNICAL'
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  title: string
  description: string
  expected_impact: string
  effort: 'LOW' | 'MEDIUM' | 'HIGH'
  timeframe: 'immediate' | 'short_term' | 'long_term'
  action_items: string[]
  success_metrics: string[]
  tools_suggested: string[]
  reasoning: string
  execution_content?: ExecutionContent[]
}

export interface ExecutionContent {
  id: string
  recommendation_id: string
  report_id: string
  type: 'BLOG_POST_IDEA' | 'BLOG_COMMENT' | 'SOCIAL_POST' |
        'DIRECTORY_SUBMISSION' | 'OUTREACH_EMAIL' | 'FORUM_POST'
  platform: string
  platform_url?: string
  content: string
  hashtags?: string[]
  status: 'DRAFT' | 'APPROVED' | 'REJECTED'
  created_at: string
}

export interface BotStats {
  total: number
  byStatus: {
    draft: number
    approved: number
    rejected: number
  }
  byType: Record<string, number>
  approvalRate: number
  readyToExecute: number
}

export interface FullReport {
  id: string
  status: 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED'
  created_at: string
  organization: Organization
  raw_crawl_data: {
    analysis: {
      technical: TechnicalAudit
      keywords: KeywordAnalysis
    }
    crawl: {
      isFallback: boolean
    }
  }
  seo_audit: {
    website_data: {
      title: string
      metaDescription: string
      headings: { h1: string[], h2: string[], h3: string[] }
      links: { internal: number, external: number, total: number }
      images: { total: number, withAlt: number, withoutAlt: number }
      performance: { responseTimeMs: number }
    }
    technical: TechnicalAudit
  }
  keyword_analysis: KeywordAnalysis
  competitor_analysis: CompetitorAnalysis
  backlink_strategy: BacklinkStrategy
  recommendations: Recommendation[]
  execution_assistant?: {
    stats: BotStats
    items: ExecutionContent[]
  }
}
