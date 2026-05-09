import logger from '../../utils/logger.js';

export async function runTechnicalSeoAudit(crawlData) {
  const website = crawlData?.website || {};
  const seo = website?.seo || {};
  const headings = website?.headings || { h1: [], h2: [], h3: [] };
  const images = website?.images || {};
  const technical = website?.technical || {};
  const performance = website?.performance || {};
  const isFallback = website?.isFallback === true;

  if (isFallback) {
    return {
      score: 0,
      grade: 'N/A',
      isFallback: true,
      fallbackReason: website.fallbackReason,
      breakdown: {
        headings: { score: 0, max: 20 },
        images: { score: 0, max: 20 },
        technical: { score: 0, max: 30 },
        performance: { score: 0, max: 30 }
      },
      issues: [{
        check: 'website_access',
        severity: 'critical',
        message: `Website could not be crawled: ${website.fallbackReason}`,
        recommendation: 'Ensure website is publicly accessible and not blocking automated requests. Check robots.txt and WAF settings.'
      }],
      passed: [],
      auditedAt: new Date().toISOString()
    };
  }

  // Full Audit Logic with Null Safety
  const issues = [];
  const passed = [];

  // 1. Heading Audit
  let headingScore = 0;
  if (headings.h1?.length === 1) {
    headingScore += 20;
    passed.push('Single H1 tag found');
  } else if (headings.h1?.length === 0) {
    issues.push({ check: 'h1_missing', severity: 'critical', message: 'No H1 tag found', recommendation: 'Add a single descriptive H1 tag.' });
  } else {
    issues.push({ check: 'h1_multiple', severity: 'warning', message: 'Multiple H1 tags found', recommendation: 'Consolidate to a single H1 tag.' });
  }

  // 2. SEO Audit
  let seoScore = 0;
  if ((seo.title || '').length >= 30 && (seo.title || '').length <= 60) {
    seoScore += 15;
    passed.push('Title tag length is optimal');
  } else {
    issues.push({ check: 'title_length', severity: 'warning', message: 'Title tag length suboptimal', recommendation: 'Aim for 30-60 characters.' });
  }

  if (seo.metaDescription) {
    seoScore += 15;
    passed.push('Meta description found');
  } else {
    issues.push({ check: 'meta_description_missing', severity: 'critical', message: 'Meta description missing', recommendation: 'Add a 150-160 character description.' });
  }

  // Final assembly
  const totalScore = headingScore + seoScore; // Simplified for this example

  return {
    score: totalScore,
    grade: totalScore > 80 ? 'A' : totalScore > 60 ? 'B' : totalScore > 40 ? 'C' : 'D',
    isFallback: false,
    breakdown: {
      headings: { score: headingScore, max: 20 },
      seo: { score: seoScore, max: 30 }
    },
    issues,
    passed,
    auditedAt: new Date().toISOString()
  };
}
