// Async handler to wrap async functions and catch errors
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Generate random string
export const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, ''); // Basic XSS prevention
};

// Format success response
export const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    status: 'success',
    message
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Format error response
export const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    status: 'error',
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
