// ============================================
// IMPROVED AUTHENTICATION MIDDLEWARE
// ============================================

const jwt = require('jsonwebtoken')

// Error handler for auth errors
const sendAuthError = (res, status, message) => {
  return res.status(status).json({
    success: false,
    message,
    code: 'AUTH_ERROR'
  })
}

// ─── VERIFY TOKEN ───
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendAuthError(res, 401, 'No token provided. Use: Authorization: Bearer <token>')
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user to request object (PROPER way)
    req.user = decoded
    req.userId = decoded.id
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendAuthError(res, 401, 'Token expired. Please login again.')
    }
    if (error.name === 'JsonWebTokenError') {
      return sendAuthError(res, 401, 'Invalid token. Please login again.')
    }
    sendAuthError(res, 500, 'Authentication error')
  }
}

// ─── VERIFY USER (PATIENT) ───
const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Patient role required.',
        code: 'FORBIDDEN'
      })
    }
    next()
  })
}

// ─── VERIFY DOCTOR ───
const verifyDoctor = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Doctor role required.',
        code: 'FORBIDDEN'
      })
    }
    next()
  })
}

// ─── VERIFY ADMIN ───
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.',
        code: 'FORBIDDEN'
      })
    }
    next()
  })
}

// ─── VERIFY MULTIPLE ROLES ───
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    verifyToken(req, res, () => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
          code: 'FORBIDDEN'
        })
      }
      next()
    })
  }
}

// ─── VERIFY RESOURCE OWNERSHIP ───
const verifyResourceOwnership = (resourceUserId) => {
  return (req, res, next) => {
    const ownerId = resourceUserId(req)
    if (ownerId.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this resource.',
        code: 'FORBIDDEN'
      })
    }
    next()
  }
}

module.exports = {
  verifyToken,
  verifyUser,
  verifyDoctor,
  verifyAdmin,
  verifyRoles,
  verifyResourceOwnership
}