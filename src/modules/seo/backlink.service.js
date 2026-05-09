import { ai } from '../../utils/ai.js';
import logger from '../../utils/logger.js';

export const generateBacklinkOpportunities = async (org, competitorData) => {
  const competitorContext = competitorData?.competitors?.length > 0
    ? `Competitor landscape: ${JSON.stringify(competitorData.competitors.slice(0, 3))}`
    : `Note: Competitor sites were blocked. Analyze based on industry knowledge for ${org.industry}.`;

  const prompt = `
    Generate high-authority backlink opportunities for ${org.name}.
    ${competitorContext}
    
    Identify 5 specific platforms (guest posts, directories, niches) and a 3-month strategy.
    Return only valid JSON.
  `;

  try {
    return await ai.generateJson(prompt);
  } catch (error) {
    logger.error(`Backlink analysis LLM error: ${error.message}`);
    return { 
      error: true, 
      message: error.message,
      opportunities: [],
      quick_wins: []
    };
  }
};
