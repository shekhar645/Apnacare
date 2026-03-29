const doctorModel = require('../models/doctorModel')

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password -email')
    res.json({ success: true, doctors })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

module.exports = { doctorList }