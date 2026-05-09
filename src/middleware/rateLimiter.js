import { rateLimit } from 'express-rate-limit';
import { sendError } from '../utils/apiResponse.js';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // Increased to support high-frequency dashboard polling (1 req/3s = 300/window)
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    return sendError(res, 'Too many requests from this IP, please try again after 15 minutes', 429);
  },
});
