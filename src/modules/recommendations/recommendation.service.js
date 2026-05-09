import prisma from '../../config/database.js';
import { ai } from '../../utils/ai.js';
import logger from '../../utils/logger.js';

/**
 * generateRecommendations - AI-Powered Strategic Roadmap Engine
 * Fixed: Argument alignment, Effort enum mapping, and createMany stability
 */
export async function generateRecommendations(reportId) {
  const report = await prisma.seoReport.findUnique({
    where: { id: reportId },
    include: { organization: true }
  });

  if (!report) {
    logger.error(`[Recommendation Engine] Report ${reportId} not found.`);
    throw new Error("Report not found");
  }

  const crawlData = report.raw_crawl_data?.analysis || {};
  const technical = crawlData.technical || {};
  const keywords = crawlData.keywords || {};

  try {
    // 1. PRIMARY: AI-Generated Strategic Roadmap
    const prompt = `
      Generate a professional SEO Strategic Roadmap for ${report.organization.name}.
      Audit Findings:
      - Technical Issues: ${JSON.stringify(technical.issues || [])}
      - Top Keywords: ${JSON.stringify(keywords.primary_keywords || [])}
      
      Return a JSON array of objects:
      [{ "title": "string", "description": "string", "priority": "HIGH|MEDIUM|LOW", "category": "TECHNICAL|CONTENT|BACKLINK", "impact_score": number(1-100), "effort": "LOW|MEDIUM|HIGH" }]
    `;

    const recommendations = await ai.generateJson(prompt);
    
    if (Array.isArray(recommendations) && recommendations.length > 0) {
      await saveRecommendations(reportId, recommendations);
      return recommendations;
    }
    throw new Error("AI returned empty recommendations");

  } catch (err) {
    logger.warn(`AI Roadmap generation failed for ${reportId}: ${err.message}. Engaging Guaranteed Roadmap Protocol.`);
    
    // 2. SECONDARY: Guaranteed Roadmap Engine (Surgical Data-Driven Fallback)
    const fallbackRecs = [];

    if ((technical.issues || []).length > 0) {
      technical.issues.slice(0, 3).forEach(issue => {
        fallbackRecs.push({
          title: `Resolve ${issue.check || 'Technical Issue'}`,
          description: `Our audit detected critical issues: ${issue.message || 'Suboptimal configuration'}. Resolving this will improve crawl efficiency for ${report.organization.name}.`,
          priority: "HIGH",
          category: "TECHNICAL",
          impact_score: 85,
          effort: "MEDIUM"
        });
      });
    }

    fallbackRecs.push(
      {
        title: "Enhance Core Web Vitals",
        description: "Optimize Page Experience standards (LCP, CLS) to improve mobile search rankings.",
        priority: "MEDIUM",
        category: "TECHNICAL",
        impact_score: 65,
        effort: "HIGH"
      },
      {
        title: "Scale Authority Backlinks",
        description: "Develop a strategic link-building campaign to increase domain authority.",
        priority: "LOW",
        category: "BACKLINK",
        impact_score: 60,
        effort: "HIGH"
      }
    );

    await saveRecommendations(reportId, fallbackRecs);
    return fallbackRecs;
  }
}

/**
 * saveRecommendations - Surgical Bulk Committer
 * Fixed: Enum mapping for Effort/Priority to prevent Prisma crashes
 */
async function saveRecommendations(reportId, recs) {
  // Clear existing
  await prisma.recommendation.deleteMany({ where: { report_id: reportId } });
  
  // Strict Enum Mapping to prevent database crashes
  const validEfforts = ['LOW', 'MEDIUM', 'HIGH'];
  const validPriorities = ['HIGH', 'MEDIUM', 'LOW'];
  const validCategories = ['KEYWORD', 'CONTENT', 'BACKLINK', 'TECHNICAL'];

  const data = recs.map(rec => {
    // Sanitize Effort
    let effort = String(rec.effort).toUpperCase();
    if (!validEfforts.includes(effort)) effort = 'MEDIUM';

    // Sanitize Priority
    let priority = String(rec.priority).toUpperCase();
    if (!validPriorities.includes(priority)) priority = 'MEDIUM';

    // Sanitize Category
    let category = String(rec.category).toUpperCase();
    if (!validCategories.includes(category)) category = 'TECHNICAL';

    return {
      report_id: reportId,
      title: rec.title || 'Untitled Strategic Action',
      description: rec.description || 'Action required to optimize search presence.',
      priority: priority,
      category: category,
      impact_score: typeof rec.impact_score === 'number' ? rec.impact_score : 50,
      effort: effort
    };
  });

  // Save new ones in bulk
  if (data.length > 0) {
    await prisma.recommendation.createMany({ data });
  }
}
