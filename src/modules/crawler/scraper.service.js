import axios from 'axios';
import * as cheerio from 'cheerio';
import logger from '../../utils/logger.js';

/*
 * CRAWLER COMPATIBILITY NOTES:
 *
 * Sites that work well (low/no bot protection):
 * ✅ https://example.com
 * ✅ https://neilpatel.com
 * ✅ https://moz.com
 * ✅ https://ahrefs.com/blog
 * ✅ https://backlinko.com
 * ✅ https://en.wikipedia.org
 *
 * Sites that commonly block crawlers:
 * ❌ linkedin.com (always 999/blocked)
 * ❌ instagram.com (auth wall)
 * ❌ amazon.com (aggressive WAF)
 * ❌ Many banking/govt sites (Cloudflare)
 *
 * When blocked: system uses fallback mode.
 * LLM analysis continues using org details + industry knowledge.
 * Technical audit returns score: 0, grade: N/A.
 */

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Cache-Control': 'max-age=0'
};

export async function scrapeWebsite(url) {
  const startTime = Date.now();
  
  // 1. URL Normalization
  let normalizedUrl = url.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  const getFallback = (reason) => ({
    url: normalizedUrl,
    scrapedAt: new Date().toISOString(),
    isFallback: true,
    fallbackReason: reason,
    seo: { title: null, metaDescription: null, metaKeywords: null, canonicalUrl: null, robotsMeta: null, ogTitle: null, ogDescription: null, ogImage: null, viewport: null },
    headings: { h1: [], h2: [], h3: [] },
    links: { internalLinks: 0, externalLinks: 0, totalLinks: 0 },
    images: { totalImages: 0, imagesWithAlt: 0, imagesWithoutAlt: 0 },
    technical: { hasHttps: normalizedUrl.startsWith('https://'), hasSitemap: false, hasRobotsTxt: false },
    performance: { responseTimeMs: Date.now() - startTime }
  });

  try {
    // 2. Fetch HTML
    let response;
    try {
      response = await axios.get(normalizedUrl, {
        headers: BROWSER_HEADERS,
        timeout: 15000,
        maxRedirects: 10,
        validateStatus: (status) => status < 500,
        decompress: true
      });
    } catch (err) {
      // If HTTPS fails, try HTTP as a last resort
      if (normalizedUrl.startsWith('https://')) {
        const httpUrl = normalizedUrl.replace('https://', 'http://');
        logger.warn(`HTTPS failed for ${normalizedUrl}, retrying with HTTP...`);
        response = await axios.get(httpUrl, {
          headers: BROWSER_HEADERS,
          timeout: 10000,
          validateStatus: (status) => status < 500
        });
      } else {
        throw err;
      }
    }

    // 3. Handle Status Codes
    if (response.status === 403) return getFallback('Website blocked crawler (403 Forbidden)');
    if (response.status === 429) return getFallback('Rate limited by website (429)');
    if (response.status === 503) return getFallback('Website temporarily unavailable (503)');
    if (response.status >= 400) return getFallback(`Website returned status ${response.status}`);

    // 4. Parse HTML
    const $ = cheerio.load(response.data);
    const domain = new URL(normalizedUrl).hostname;

    const seo = {
      title: $('title').text().trim() || null,
      metaDescription: $('meta[name="description"]').attr('content') || null,
      metaKeywords: $('meta[name="keywords"]').attr('content') || null,
      canonicalUrl: $('link[rel="canonical"]').attr('href') || null,
      robotsMeta: $('meta[name="robots"]').attr('content') || null,
      ogTitle: $('meta[property="og:title"]').attr('content') || null,
      ogDescription: $('meta[property="og:description"]').attr('content') || null,
      ogImage: $('meta[property="og:image"]').attr('content') || null,
      viewport: $('meta[name="viewport"]').attr('content') || null,
    };

    const headings = {
      h1: $('h1').map((i, el) => $(el).text().trim()).get(),
      h2: $('h2').map((i, el) => $(el).text().trim()).get(),
      h3: $('h3').map((i, el) => $(el).text().trim()).get(),
    };

    const links = {
      internalLinks: $('a[href]').filter((i, el) => ($(el).attr('href') || '').includes(domain)).length,
      externalLinks: $('a[href]').filter((i, el) => {
        const href = $(el).attr('href') || '';
        return href.startsWith('http') && !href.includes(domain);
      }).length,
      totalLinks: $('a').length
    };

    const totalImages = $('img').length;
    const imagesWithAlt = $('img[alt]').filter((i, el) => ($(el).attr('alt') || '').trim() !== '').length;

    const data = {
      url: normalizedUrl,
      scrapedAt: new Date().toISOString(),
      isFallback: false,
      fallbackReason: null,
      seo,
      headings,
      links,
      images: {
        totalImages,
        imagesWithAlt,
        imagesWithoutAlt: totalImages - imagesWithAlt
      },
      technical: {
        hasHttps: normalizedUrl.startsWith('https://'),
        hasSitemap: false,
        hasRobotsTxt: false
      },
      performance: { responseTimeMs: Date.now() - startTime }
    };

    // 5. Technical Checks (Non-blocking)
    try {
      const baseUrl = new URL(normalizedUrl).origin;
      const [sitemap, robots] = await Promise.allSettled([
        axios.get(`${baseUrl}/sitemap.xml`, { headers: BROWSER_HEADERS, timeout: 5000 }),
        axios.get(`${baseUrl}/robots.txt`, { headers: BROWSER_HEADERS, timeout: 5000 })
      ]);
      data.technical.hasSitemap = sitemap.status === 'fulfilled' && sitemap.value.status === 200;
      data.technical.hasRobotsTxt = robots.status === 'fulfilled' && robots.value.status === 200;
    } catch (e) { /* Ignore */ }

    return data;

  } catch (error) {
    logger.warn(`Scrape failed for ${normalizedUrl}: ${error.message}`);
    return getFallback(error.message);
  }
}

/**
 * Fetch Search Intelligence via SerpAPI
 */
export async function fetchSearchIntelligence(orgName, keywords = []) {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey) {
    logger.warn('SERP_API_KEY missing, skipping search intelligence');
    return { orgSearch: [], keywordSearch: [] };
  }

  try {
    // 1. Search for Organization
    const orgResponse = await axios.get('https://serpapi.com/search', {
      params: { q: orgName, api_key: apiKey, engine: 'google', num: 5 }
    });

    // 2. Search for Primary Keywords
    const keywordTasks = keywords.slice(0, 3).map(kw => 
      axios.get('https://serpapi.com/search', {
        params: { q: kw, api_key: apiKey, engine: 'google', num: 5 }
      })
    );

    const keywordResponses = await Promise.allSettled(keywordTasks);
    
    return {
      orgSearch: orgResponse.data?.organic_results || [],
      keywordSearch: keywordResponses
        .filter(r => r.status === 'fulfilled')
        .map(r => ({
          query: r.value.config.params.q,
          results: r.value.data?.organic_results || []
        }))
    };
  } catch (error) {
    logger.error(`Search intelligence failed: ${error.message}`);
    return { orgSearch: [], keywordSearch: [] };
  }
}
