export const buildRecommendationPrompt = (org, analysis) => {
  const { keywords, technical, competitors, backlinks } = analysis;

  const systemPrompt = "You are a senior SEO consultant with 15+ years of experience helping businesses grow organic traffic. You generate precise, actionable, prioritized SEO recommendations based on data. Always respond with valid JSON only. No markdown, no explanation, no code fences. Only raw JSON.";

  const userPrompt = `Based on the complete SEO analysis below, generate a comprehensive set of prioritized recommendations.

=== ORGANIZATION ===
Name: ${org.name}
Website: ${org.website}
Industry: ${org.industry}
Target Audience: ${org.target_audience}
Geography: ${org.geography || 'Global'}
Services: ${org.services.join(', ')}

=== TECHNICAL SEO AUDIT ===
Score: ${technical.score}/100 (Grade: ${technical.grade})
Critical Issues: ${technical.issues
    ?.filter(i => i.severity === 'critical')
    .map(i => i.message)
    .join(', ') || 'None'}
Warnings: ${technical.issues
    ?.filter(i => i.severity === 'warning')
    .map(i => i.message)
    .join(', ') || 'None'}

=== KEYWORD ANALYSIS ===
Primary Keywords: ${keywords.primary_keywords
    ?.slice(0, 5).map(k => k.keyword || k).join(', ') || 'None'}
Secondary Keywords: ${keywords.secondary_keywords
    ?.slice(0, 5).map(k => k.keyword || k).join(', ') || 'None'}
Top Longtail: ${keywords.longtail_keywords
    ?.slice(0, 5).map(k => k.keyword || k).join(', ') || 'None'}
Keyword Gaps: ${keywords.keyword_gaps?.join(', ') || 'None'}

=== COMPETITOR INSIGHTS ===
Threat Level: ${competitors.threat_level || 'N/A'}
Content Gaps: ${competitors.content_gaps?.join(', ') || 'None'}
Keyword Opportunities: ${competitors.keyword_opportunities
    ?.slice(0, 5).join(', ') || 'None'}
Positioning: ${competitors.positioning_recommendations
    ?.slice(0, 3).join(', ') || 'None'}

=== BACKLINK OPPORTUNITIES ===
Quick Wins: ${backlinks.quick_wins?.join(', ') || 'None'}
Top Opportunity Types: ${backlinks.opportunities
    ?.slice(0, 3).map(o => o.type).join(', ') || 'None'}

Generate recommendations in this EXACT JSON format:
{
  "recommendations": [
    {
      "id": string (format: "rec_001", "rec_002" etc),
      "category": "keyword|content|backlink|technical",
      "priority": "high|medium|low",
      "title": string (max 80 chars, action-oriented),
      "description": string (2-3 sentences, specific),
      "expected_impact": string (quantified if possible),
      "effort": "low|medium|high",
      "timeframe": "immediate|short_term|long_term",
      "action_items": [string] (3-5 specific steps),
      "success_metrics": [string] (2-3 measurable KPIs),
      "tools_suggested": [string] (real tools like Ahrefs, etc),
      "reasoning": string (why this matters for this org specifically)
    }
  ],
  "executive_summary": string (3-4 sentences overall assessment),
  "quick_wins": [string] (5 things to do this week),
  "priority_order": [string] (rec ids in execution order),
  "estimated_timeline": string,
  "expected_traffic_impact": string
}

Rules:
- Generate exactly 15 recommendations total
- Distribution: 4 keyword, 4 content, 4 backlink, 3 technical
- Priority distribution: 5 high, 6 medium, 4 low
- Timeframe: 5 immediate, 6 short_term, 4 long_term
- action_items: exactly 4 per recommendation
- success_metrics: exactly 2 per recommendation
- Every recommendation must be specific to THIS organization
- Do not generate generic SEO advice
- Reference actual data from the analysis above`;

  return { systemPrompt, userPrompt };
};
