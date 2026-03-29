const doctorModel = require('../models/doctorModel')
const appointmentModel = require('../models/appointmentModel')
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8FFD&color=fff&size=200&bold=true`
    const doctorData = {
      name, email,
      image: imageUrl,
      password: hashedPassword,
      speciality, degree, experience, about,
      fees: Number(fees),
      address: typeof address === 'string' ? JSON.parse(address) : address
    }
    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()
    res.json({ success: true, message: 'Doctor added successfully' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({ success: true, doctors })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const allAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({})
    res.json({ success: true, appointments })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
    res.json({ success: true, message: 'Appointment cancelled' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body
    await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
    res.json({ success: true, message: 'Appointment completed' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body
    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
    res.json({ success: true, message: 'Availability changed' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const getDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({})
    const appointments = await appointmentModel.find({})
    const patients = await userModel.find({})
    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5)
    }
    res.json({ success: true, dashData })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

module.exports = { addDoctor, adminLogin, allDoctors, allAppointments, cancelAppointment, completeAppointment, changeAvailability, getDashboard }