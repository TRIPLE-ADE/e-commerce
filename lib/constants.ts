// Cart constants
export const CART_TTL_SECONDS = 30 * 24 * 60 * 60 // 30 days
export const CART_PREFIX = 'cart:'

// Search constants
export const SEARCH_DEBOUNCE_MS = 300
export const SEARCH_MIN_LENGTH = 1
export const MAX_SEARCH_RESULTS = 5

// API constants
export const MAX_REQUEST_SIZE = 1024 * 1024 // 1MB
export const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 100

// Image constants
export const IMAGE_PRIORITY_THRESHOLD = 3 // First 3 images get priority

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error',
  CART_EMPTY: 'Cart is empty',
  PRODUCT_NOT_FOUND: 'Product not found',
  INVALID_INPUT: 'Invalid input provided',
  OUT_OF_STOCK: 'Product is out of stock',
} as const
