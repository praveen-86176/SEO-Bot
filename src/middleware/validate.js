import { sendError } from '../utils/apiResponse.js';

/**
 * Middleware to validate request body using Zod schema
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errorMessages = result.error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));

    return sendError(res, 'Validation failed', 400, errorMessages);
  }

  // Update req.body with parsed/transformed data
  req.body = result.data;
  next();
};

export default validate;
