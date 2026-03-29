const jwt = require('jsonwebtoken')

const authAdmin = async (req, res, next) => {
  try {
    const atoken = req.headers.atoken
    if (!atoken) {
      return res.json({ success: false, message: 'Not authorized' })
    }
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET)
    if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({ success: false, message: 'Invalid admin token' })
    }
    next()
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

module.exports = authAdmin