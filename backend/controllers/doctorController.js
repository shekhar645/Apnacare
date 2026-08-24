const doctorModel = require('../models/doctorModel')
const appointmentModel = require('../models/appointmentModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password -email')
    res.json({ success: true, doctors })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const doctor = await doctorModel.findOne({ email })
    if (!doctor) return res.json({ success: false, message: 'Doctor not found' })
    const isMatch = await bcrypt.compare(password, doctor.password)
    if (!isMatch) return res.json({ success: false, message: 'Invalid password' })
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const getDoctorAppointments = async (req, res) => {
  try {
    const { docId } = req.body
    const appointments = await appointmentModel.find({ docId })
    res.json({ success: true, appointments })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const getDoctorProfile = async (req, res) => {
  try {
    const { docId } = req.body
    const doctor = await doctorModel.findById(docId).select('-password')
    res.json({ success: true, doctor })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const completeDoctorAppointment = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body
    const appointment = await appointmentModel.findById(appointmentId)
    if (appointment.docId !== docId) return res.json({ success: false, message: 'Not authorized' })
    await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
    res.json({ success: true, message: 'Appointment completed' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const cancelDoctorAppointment = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body
    const appointment = await appointmentModel.findById(appointmentId)
    if (appointment.docId !== docId) return res.json({ success: false, message: 'Not authorized' })
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
    res.json({ success: true, message: 'Appointment cancelled' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, available } = req.body
    await doctorModel.findByIdAndUpdate(docId, { fees, available })
    res.json({ success: true, message: 'Profile updated' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

module.exports = {
  doctorList, doctorLogin, getDoctorAppointments,
  getDoctorProfile, completeDoctorAppointment,
  cancelDoctorAppointment, updateDoctorProfile
}