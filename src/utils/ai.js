import { anthropic, groq, AI_CONFIG } from '../config/llm.js';
import logger from './logger.js';
import AppError from './appError.js';

/**
 * Helper to clean and parse JSON from AI response
 */
export const parseAIJson = (text) => {
  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    logger.error('Failed to parse AI JSON:', text);
    throw new AppError("AI returned invalid JSON format", 500);
  }
};

/**
 * Unified AI call utility with Smart Fallback
 */
export const callAI = async ({ systemPrompt, userPrompt, temperature = 0, maxTokens = 4000 }) => {
  const modelsToTry = [
    AI_CONFIG.groq.model, // Primary (e.g. llama-3.3-70b-versatile)
    'llama3-8b-8192',     // Official Groq ID for Llama 3 8B
    'mixtral-8x7b-32768'  // Secondary Backup
  ];

  if (groq) {
    for (const model of modelsToTry) {
      try {
        logger.info(`Using Groq LLM (${model})`);
        const response = await groq.chat.completions.create({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: temperature,
          max_tokens: maxTokens,
          response_format: { type: "json_object" }
        });

        return response.choices[0].message.content;
      } catch (error) {
        const isRateLimit = error.message.includes('429') || error.message.includes('rate_limit');
        const isNotFound = error.message.includes('404') || error.message.includes('model_not_found');
        
        if ((isRateLimit || isNotFound) && model !== modelsToTry[modelsToTry.length - 1]) {
          logger.warn(`Groq error for ${model}, trying backup model...`);
          continue; 
        }
        logger.warn(`Groq error for ${model}: ${error.message}`);
        if (!anthropic) break;
      }
    }
  }

  if (anthropic) {
    try {
      logger.info(`Using Anthropic LLM (${AI_CONFIG.anthropic.model})`);
      const response = await anthropic.messages.create({
        model: AI_CONFIG.anthropic.model,
        max_tokens: maxTokens,
        temperature: temperature,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      return response.content[0].text;
    } catch (error) {
      logger.error(`Anthropic LLM error: ${error.message}`);
      throw new AppError(`AI Analysis failed: ${error.message}`, 500);
    }
  }

  throw new AppError("All AI models exhausted or keys missing", 500);
};

/**
 * Unified AI Object
 */
export const ai = {
  generateJson: async (prompt, systemPrompt = "You are a senior SEO strategist. Return only valid JSON.") => {
    const text = await callAI({
      systemPrompt,
      userPrompt: prompt,
      temperature: 0.1
    });
    return parseAIJson(text);
  }
};
