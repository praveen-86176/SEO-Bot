import prisma from '../../config/database.js';

export const getCrawlerProgress = async (req, res) => {
  const { reportId } = req.params;
  
  const report = await prisma.seoReport.findUnique({
    where: { id: reportId },
    select: {
      status: true,
      raw_crawl_data: true,
      jobId: true
    }
  });

  if (!report) {
    return res.status(404).json({ success: false, message: 'Report not found' });
  }

  const raw = report.raw_crawl_data || {};
  
  // Rich Progress Mapping
  const progressMap = {
    'PENDING': { progress: 0, phase: 'queued', message: 'Waiting to start' },
    'DONE': { progress: 100, phase: 'complete', message: 'Analysis complete' },
    'FAILED': { progress: 0, phase: 'failed', message: 'Analysis failed' }
  };

  if (progressMap[report.status]) {
    return res.json({
      success: true,
      data: {
        reportId,
        status: report.status,
        ...progressMap[report.status],
        isFallback: raw?.website?.isFallback || false
      }
    });
  }

  // Determine sub-phase for PROCESSING status
  let progress = 10;
  let phase = 'crawling';
  let message = 'Crawling website and fetching search data';

  if (raw?.analysis?.analyzedAt) {
    progress = 75;
    phase = 'generating';
    message = 'Generating final recommendations';
  } else if (raw?.crawledAt) {
    progress = 40;
    phase = 'analyzing';
    message = 'Running AI SEO analysis (Phase 3)';
  }

  res.json({
    success: true,
    data: {
      reportId,
      status: report.status,
      progress,
      phase,
      message,
      isFallback: raw?.website?.isFallback || false,
      fallbackReason: raw?.website?.fallbackReason || null
    }
  });
};
