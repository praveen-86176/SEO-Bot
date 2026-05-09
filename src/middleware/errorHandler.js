import logger from '../utils/logger.js';
import { env } from '../config/env.js';
import { sendError } from '../utils/apiResponse.js';

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (env.NODE_ENV === 'development') {
    logger.error('Error 💥', {
      message: err.message,
      stack: err.stack,
      ...err,
    });

    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.statusCode,
        stack: err.stack,
      },
    });
  }

  // Production Error Response
  if (err.isOperational) {
    return sendError(res, err.message, err.statusCode);
  }

  // Programming or other unknown error: don't leak error details
  logger.error('ERROR 💥', err);
  return sendError(res, 'Something went wrong!', 500);
};

export default errorHandler;
