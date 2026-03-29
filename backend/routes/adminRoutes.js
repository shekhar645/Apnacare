const express = require('express')
const router = express.Router()
const {
  addDoctor,
  adminLogin,
  allDoctors,
  allAppointments,
  cancelAppointment,
  completeAppointment,
  changeAvailability,
  getDashboard
} = require('../controllers/adminController')
const authAdmin = require('../middleware/authAdmin')

router.post('/login', adminLogin)
router.post('/add-doctor', authAdmin, addDoctor)
router.get('/all-doctors', authAdmin, allDoctors)
router.get('/appointments', authAdmin, allAppointments)
router.post('/cancel-appointment', authAdmin, cancelAppointment)
router.post('/complete-appointment', authAdmin, completeAppointment)
router.post('/change-availability', authAdmin, changeAvailability)
router.get('/dashboard', authAdmin, getDashboard)

module.exports = router