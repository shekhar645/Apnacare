const jwt = require('jsonwebtoken')

const authDoctor = async (req, res, next) => {
  try {
    const dtoken = req.headers.dtoken
    if (!dtoken) {
      return res.json({ success: false, message: 'Not authorized' })
    }
    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET)
    req.body.docId = decoded.id
    next()
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

module.exports = authDoctor