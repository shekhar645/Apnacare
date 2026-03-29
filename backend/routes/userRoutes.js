const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment, createPaymentIntent } = require('../controllers/userController')
const authUser = require('../middleware/authUser')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/get-profile', authUser, getProfile)
router.post('/update-profile', authUser, updateProfile)
router.post('/book-appointment', authUser, bookAppointment)
router.post('/appointments', authUser, listAppointments)
router.post('/cancel-appointment', authUser, cancelAppointment)
router.post('/create-payment-intent', authUser, createPaymentIntent)

module.exports = router