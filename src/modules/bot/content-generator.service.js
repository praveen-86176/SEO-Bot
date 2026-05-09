import { callAI, parseAIJson } from '../../utils/ai.js';
import logger from '../../utils/logger.js';

/**
 * Master generator function
 */
export const generateContent = async (type, recommendation, orgData) => {
  logger.info(`Generating ${type} content for recommendation: ${recommendation.id}`);
  
  switch (type) {
    case 'BLOG_POST_IDEA':
      return await generateBlogPostIdea(recommendation, orgData);
    case 'BLOG_COMMENT':
      return await generateBlogComment(recommendation, orgData);
    case 'SOCIAL_POST':
      return await generateSocialPost(recommendation, orgData);
    case 'DIRECTORY_SUBMISSION':
      return await generateDirectoryListing(recommendation, orgData);
    case 'OUTREACH_EMAIL':
      return await generateOutreachEmail(recommendation, orgData);
    case 'FORUM_POST':
      return await generateForumPost(recommendation, orgData);
    default:
      throw new Error(`Unsupported content type: ${type}`);
  }
};

const callLLM = async (system, user, maxTokens = 1500, temperature = 0.3) => {
  const text = await callAI({ systemPrompt: system, userPrompt: user, maxTokens, temperature });
  return parseAIJson(text);
};

const generateBlogPostIdea = async (rec, org) => {
  const system = "You are an expert content strategist and SEO writer. Respond with valid JSON only.";
  const user = `Generate a detailed blog post idea for this organization.
Organization: ${org.name} (${org.industry})
Recommendation: ${rec.title}
Keywords to target: ${rec.action_items.join(', ')}

Return this exact JSON:
{
  "title": string,
  "subtitle": string,
  "target_keyword": string,
  "secondary_keywords": [string],
  "outline": [{ "section": string, "points": [string] }],
  "word_count_target": number,
  "meta_description": string,
  "call_to_action": string,
  "internal_linking_suggestions": [string],
  "estimated_read_time": string
}`;
  return await callLLM(system, user, 1500, 0.3);
};

const generateBlogComment = async (rec, org) => {
  const system = "You are an expert at writing authentic blog comments. Respond with valid JSON only.";
  const user = `Write a thoughtful blog comment for a ${org.industry} business.
Organization: ${org.name}
Recommendation context: ${rec.description}

Return this exact JSON:
{
  "comment": string,
  "author_bio": string,
  "relevance_note": string,
  "do_not_include": [string],
  "authenticity_score": number
}`;
  return await callLLM(system, user, 800, 0.4);
};

const generateSocialPost = async (rec, org) => {
  const system = "You are a social media expert. Respond with valid JSON only.";
  const user = `Generate platform-specific social media posts.
Organization: ${org.name}
Recommendation: ${rec.title}

Return this exact JSON:
{
  "linkedin": { "content": string, "hashtags": [string], "best_time_to_post": string, "content_type": string },
  "twitter": { "content": string, "hashtags": [string], "thread": [string] },
  "instagram": { "caption": string, "hashtags": [string], "content_idea": string }
}`;
  return await callLLM(system, user, 1200, 0.5);
};

const generateDirectoryListing = async (rec, org) => {
  const system = "You are an expert in business directory optimization. Respond with valid JSON only.";
  const user = `Generate an optimized business directory listing.
Organization: ${org.name}
Industry: ${org.industry}
Services: ${org.services.join(', ')}

Return this exact JSON:
{
  "business_name": string,
  "short_description": string,
  "long_description": string,
  "primary_category": string,
  "secondary_categories": [string],
  "keywords_embedded": [string],
  "unique_selling_points": [string],
  "call_to_action": string,
  "nap_reminder": string,
  "platforms_priority": [string]
}`;
  return await callLLM(system, user, 1000, 0.2);
};

const generateOutreachEmail = async (rec, org) => {
  const system = "You are an expert at outreach emails. Respond with valid JSON only.";
  const user = `Write a backlink outreach email.
From: ${org.name}
Purpose: ${rec.title}

Return this exact JSON:
{
  "subject_line": string,
  "email_body": string,
  "follow_up_1": string,
  "follow_up_2": string,
  "personalization_placeholders": [string],
  "value_proposition": string,
  "compliance_notes": string
}`;
  return await callLLM(system, user, 1000, 0.3);
};

const generateForumPost = async (rec, org) => {
  const system = "You are an expert at writing helpful forum posts. Respond with valid JSON only.";
  const user = `Write a helpful forum post or answer.
Organization: ${org.industry}
Topic: ${rec.title}

Return this exact JSON:
{
  "post_type": string,
  "title": string,
  "content": string,
  "signature": string,
  "subreddits_suggested": [string],
  "compliance_checklist": [string],
  "value_score": number
}`;
  return await callLLM(system, user, 800, 0.4);
};
