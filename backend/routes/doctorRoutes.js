const express = require('express')
const router = express.Router()
const {
  doctorList,
  doctorLogin,
  getDoctorAppointments,
  getDoctorProfile,
  completeDoctorAppointment,
  cancelDoctorAppointment,
  updateDoctorProfile
} = require('../controllers/doctorController')

const authDoctor = require('../middleware/authDoctor')

router.get('/list', doctorList)
router.post('/login', doctorLogin)
router.post('/appointments', authDoctor, getDoctorAppointments)
router.post('/profile', authDoctor, getDoctorProfile)
router.post('/complete-appointment', authDoctor, completeDoctorAppointment)
router.post('/cancel-appointment', authDoctor, cancelDoctorAppointment)
router.post('/update-profile', authDoctor, updateDoctorProfile)

module.exports = router