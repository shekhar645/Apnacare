// ============================================
// GLOBAL ERROR HANDLER MIDDLEWARE
// ============================================

// Custom Error Class
class AppError extends Error {
  constructor(message, statusCode, code = 'APP_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.code = code
    Error.captureStackTrace(this, this.constructor)
  }
}

// ─── ERROR HANDLER MIDDLEWARE ───
const errorHandler = (err, req, res, next) => {
  // Set default values
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'
  let code = err.code || 'INTERNAL_SERVER_ERROR'

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400
    code = 'VALIDATION_ERROR'
    message = 'Validation failed'
  }

  if (err.name === 'CastError') {
    statusCode = 400
    code = 'INVALID_ID'
    message = 'Invalid ID format'
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    statusCode = 409
    code = 'DUPLICATE_ENTRY'
    const field = Object.keys(err.keyPattern)[0]
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    code = 'JWT_ERROR'
    message = 'Invalid token'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    code = 'TOKEN_EXPIRED'
    message = 'Token has expired'
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', {
      message: err.message,
      statusCode,
      code,
      stack: err.stack,
      path: req.path,
      method: req.method
    })
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  })
}

// ─── 404 NOT FOUND HANDLER ───
const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Route ${req.method} ${req.path} not found`,
    404,
    'NOT_FOUND'
  )
  next(error)
}

// ─── ASYNC HANDLER WRAPPER ───
// Wrap async controller functions to catch errors
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
  asyncHandler
}