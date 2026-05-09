import { env } from './env.js';

export const serpConfig = {
  SERP_API_KEY: env.SERP_API_KEY,
  BASE_URL: "https://serpapi.com/search",
  DEFAULT_PARAMS: {
    num: 10,
    hl: 'en',
    gl: 'us',
  },
};
