const jwt = require('jsonwebtoken')

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers
    if (!token) {
      return res.json({ success: false, message: 'Not authorized, please login' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!req.body) req.body = {}
    req.body.userId = decoded.id
    next()
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

module.exports = authUser