// User roles
export const USER_ROLES = {
  SUPPLIER: 'supplier',
  BUYER: 'buyer',
  ADMIN: 'admin'
};

// Business types
export const BUSINESS_TYPES = {
  MANUFACTURER: 'manufacturer',
  WHOLESALER: 'wholesaler',
  DISTRIBUTOR: 'distributor',
  RETAILER: 'retailer',
  OTHER: 'other'
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
};

// Response messages
export const MESSAGES = {
  SUCCESS: {
    USER_REGISTERED: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logged out successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    PASSWORD_UPDATED: 'Password updated successfully'
  },
  ERROR: {
    USER_EXISTS: 'User with this email already exists',
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_DEACTIVATED: 'Account is deactivated. Please contact support.',
    UNAUTHORIZED: 'Access denied. No token provided.',
    FORBIDDEN: 'Access denied. Insufficient permissions.',
    NOT_FOUND: 'Resource not found',
    SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation failed'
  }
};

// Database collection names
export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  INQUIRIES: 'inquiries',
  REVIEWS: 'reviews'
};
