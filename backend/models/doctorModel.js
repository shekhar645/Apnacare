const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  speciality: { type: String, required: true },
  degree: { type: String, required: true },
  experience: { type: String, required: true },
  about: { type: String, required: true },
  available: { type: Boolean, default: true },
  fees: { type: Number, required: true },
  salary: { type: Number, default: 0 },
  salaryHistory: [
    {
      month: { type: String },
      amount: { type: Number },
      paidOn: { type: Date, default: Date.now },
      appointments: { type: Number }
    }
  ],
  address: { type: Object, default: { line1: '', line2: '' } },
  slots_booked: { type: Object, default: {} }
}, { timestamps: true })

module.exports = mongoose.model('Doctor', doctorSchema)