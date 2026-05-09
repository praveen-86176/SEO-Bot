import prisma from '../../config/database.js';
import redis from '../../config/redis.js';
import AppError from '../../utils/appError.js';
import logger from '../../utils/logger.js';
import { seoQueue } from '../../config/queue.js';

export const getFullReport = async (reportId) => {
  const report = await prisma.seoReport.findUnique({
    where: { id: reportId },
    include: {
      organization: true,
      keyword_analysis: true,
      competitor_analysis: true,
      recommendations: {
        include: {
          execution_content: true,
        },
        orderBy: [
          { priority: 'asc' },
          { category: 'asc' },
        ],
      },
    },
  });

  if (!report) throw new AppError("Report not found", 404);

  const rawCrawlData = report.raw_crawl_data || {};
  const analysis = rawCrawlData.analysis || {};
  const recommendationsMeta = rawCrawlData.recommendations_meta || {};

  // Group stats
  const recStats = report.recommendations.reduce((acc, r) => {
    acc.by_category[r.category.toLowerCase()] = (acc.by_category[r.category.toLowerCase()] || 0) + 1;
    acc.by_priority[r.priority.toLowerCase()] = (acc.by_priority[r.priority.toLowerCase()] || 0) + 1;
    return acc;
  }, { by_category: {}, by_priority: {} });

  const executionStats = report.recommendations.reduce((acc, r) => {
    r.execution_content.forEach(ec => {
      acc.total++;
      acc[ec.status.toLowerCase()]++;
    });
    return acc;
  }, { total: 0, draft: 0, approved: 0, rejected: 0 });

  executionStats.approval_rate = executionStats.total ? Math.round((executionStats.approved / executionStats.total) * 100) : 0;

  return {
    report: {
      id: report.id,
      status: report.status,
      jobId: report.jobId,
      createdAt: report.created_at,
      completedAt: recommendationsMeta.generatedAt || null,
    },
    organization: report.organization,
    seo_audit: {
      website_data: rawCrawlData.website || {},
      technical: analysis.technical || {},
    },
    keyword_analysis: {
      ...analysis.keywords,
      reasoning: report.keyword_analysis?.reasoning,
    },
    competitor_analysis: analysis.competitors || {},
    backlink_strategy: analysis.backlinks || {},
    recommendations: {
      meta: recommendationsMeta,
      total: report.recommendations.length,
      ...recStats,
      items: report.recommendations.map(r => ({
        ...r,
        execution_content_count: r.execution_content.length,
      })),
    },
    execution_assistant: {
      stats: executionStats,
      items: report.recommendations.flatMap(r => r.execution_content),
    },
    generated_at: new Date().toISOString(),
  };
};

export const getReportSummary = async (reportId) => {
  const report = await prisma.seoReport.findUnique({
    where: { id: reportId },
    include: {
      organization: true,
      recommendations: { select: { priority: true } },
    },
  });

  if (!report) throw new AppError("Report not found", 404);

  const rawCrawlData = report.raw_crawl_data || {};
  const analysis = rawCrawlData.analysis || {};
  const technical = analysis.technical || {};
  const keywords = analysis.keywords || {};

  const approvedCount = await prisma.executionContent.count({
    where: { report_id: reportId, status: 'APPROVED' },
  });

  return {
    report: { id: report.id, status: report.status, createdAt: report.created_at },
    organization: {
      name: report.organization.name,
      website: report.organization.website,
      industry: report.organization.industry,
    },
    scores: {
      technical_score: technical.score || 0,
      technical_grade: technical.grade || 'N/A',
      total_recommendations: report.recommendations.length,
      high_priority_count: report.recommendations.filter(r => r.priority === 'HIGH').length,
      approved_content_count: approvedCount,
    },
    top_keywords: keywords.primary_keywords?.slice(0, 5).map(k => k.keyword || k) || [],
    top_quick_wins: rawCrawlData.recommendations_meta?.quick_wins?.slice(0, 3) || [],
    status_message: getStatusMessage(report.status),
  };
};

export const getReportStatus = async (reportId) => {
  const report = await prisma.seoReport.findUnique({
    where: { id: reportId },
    include: { 
      keyword_analysis: true,
      organization: {
        select: { name: true, website: true }
      }
    },
  });

  if (!report) throw new AppError("Report not found", 404);

  let progress = 0;
  let phase = 'INITIALIZING';
  let message = 'Preparing your SEO strategy...';

  if (report.status === 'PENDING') {
    progress = 5;
    phase = 'QUEUED';
    message = 'Your analysis is in the queue';
  } else if (report.status === 'PROCESSING') {
    const rawCrawlData = report.raw_crawl_data || {};
    if (!rawCrawlData.website) {
      progress = 25;
      phase = 'CRAWLING';
      message = 'Searching for website insights...';
    } else if (!report.keyword_analysis) {
      progress = 55;
      phase = 'ANALYZING';
      message = 'AI is mapping keyword opportunities...';
    } else {
      progress = 85;
      phase = 'RECOMMENDING';
      message = 'Finalizing your prioritized roadmap...';
    }
  } else if (report.status === 'DONE') {
    progress = 100;
    phase = 'COMPLETED';
    message = 'Success! Your roadmap is ready.';
  } else if (report.status === 'FAILED') {
    progress = 0;
    phase = 'FAILED';
    message = 'Something went wrong. The site might be blocking us.';
  }

  return {
    reportId,
    status: report.status,
    progress,
    phase,
    message,
    organization: report.organization,
    createdAt: report.created_at,
    completedAt: report.raw_crawl_data?.recommendations_meta?.generatedAt || null,
  };
};

export const getReportsByOrg = async (orgId) => {
  const reports = await prisma.seoReport.findMany({
    where: { org_id: orgId },
    orderBy: { created_at: 'desc' },
  });

  return reports.map(r => ({
    id: r.id,
    status: r.status,
    createdAt: r.created_at,
    jobId: r.jobId,
  }));
};

export const deleteReport = async (reportId) => {
  const report = await prisma.seoReport.findUnique({ where: { id: reportId } });
  if (!report) throw new AppError("Report not found", 404);

  await prisma.$transaction([
    prisma.executionContent.deleteMany({ where: { report_id: reportId } }),
    prisma.recommendation.deleteMany({ where: { report_id: reportId } }),
    prisma.competitorAnalysis.deleteMany({ where: { report_id: reportId } }),
    prisma.keywordAnalysis.deleteMany({ where: { report_id: reportId } }),
    prisma.seoReport.delete({ where: { id: reportId } }),
  ]);

  // Invalidate Redis keys
  const keys = await redis.keys(`*:${reportId}`);
  if (keys.length > 0) await redis.del(keys);
  await redis.del(`recommendations:${reportId}`);

  return { deleted: true, reportId };
};

const getStatusMessage = (status) => {
  switch (status) {
    case 'PENDING': return 'Report is waiting to start';
    case 'PROCESSING': return 'Analysis is currently in progress';
    case 'DONE': return 'Analysis completed successfully';
    case 'FAILED': return 'Analysis failed to complete';
    default: return 'Unknown status';
  }
};
