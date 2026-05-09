/**
 * Standard success response helper
 */
export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standard error response helper
 */
export const sendError = (res, message = 'Error', statusCode = 400, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: statusCode,
      ...(errors && { details: errors }),
    },
  });
};
