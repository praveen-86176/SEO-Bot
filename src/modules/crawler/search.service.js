import axios from 'axios';
import { env } from '../../config/env.js';
import logger from '../../utils/logger.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchMultipleSearchResults(queries) {
  if (!env.SERP_API_KEY) {
    logger.warn("SERP_API_KEY not configured — returning empty search results");
    return [];
  }

  const results = [];
  for (const queryObj of queries) {
    try {
      await sleep(500); // 500ms delay to avoid rate limits
      
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          q: queryObj.query,
          api_key: env.SERP_API_KEY,
          engine: 'google',
          num: 10
        }
      });

      results.push({
        query: queryObj.query,
        type: queryObj.type,
        organic: response.data.organic_results || [],
        relatedSearches: response.data.related_searches || [],
        error: false
      });
    } catch (err) {
      logger.warn(`SerpAPI query failed for "${queryObj.query}": ${err.message}`);
      results.push({
        query: queryObj.query,
        type: queryObj.type,
        error: true,
        organic: [],
        relatedSearches: []
      });
    }
  }
  return results;
}
