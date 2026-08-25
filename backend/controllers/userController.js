const userModel = require('../models/userModel')
const doctorModel = require('../models/doctorModel')
const appointmentModel = require('../models/appointmentModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html })
  } catch (error) {
    console.log('Email error:', error.message)
  }
}

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Please fill all fields' })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: 'Password must be at least 8 characters' })
    }

    const exists = await userModel.findOne({ email: email.toLowerCase() })
    if (exists) return res.json({ success: false, message: 'User already exists' })

    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new userModel({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'patient'
    })

    await newUser.save()
    const token = generateToken(newUser._id, 'patient')

    res.json({
      success: true,
      message: 'Account created successfully! 🎉',
      token,
      user: { id: newUser._id, name, email, role: 'patient' }
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.json({ success: false, message: 'Please provide email and password' })
    }

    const user = await userModel.findOne({ email: email.toLowerCase() })
    if (!user) return res.json({ success: false, message: 'User not found' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.json({ success: false, message: 'Invalid password' })

    const token = generateToken(user._id, 'patient')

    res.json({
      success: true,
      message: 'Welcome back! 👋',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: 'patient' }
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body
    const userData = await userModel.findById(userId).select('-password')
    res.json({ success: true, userData })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, gender, dob } = req.body
    await userModel.findByIdAndUpdate(userId, {
      name, phone,
      address: typeof address === 'string' ? JSON.parse(address) : address,
      gender, dob
    })
    res.json({ success: true, message: 'Profile updated ✅' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body

    const docData = await doctorModel.findById(docId).select('-password')
    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor not available' })
    }

    let slots_booked = docData.slots_booked || {}

    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res.json({ success: false, message: 'Slot not available' })
    }

    const userData = await userModel.findById(userId).select('-password')
    delete docData.slots_booked

    const appointmentData = {
      userId, docId, userData, docData,
      amount: docData.fees,
      slotTime, slotDate,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    if (!slots_booked[slotDate]) {
      slots_booked[slotDate] = []
    }
    slots_booked[slotDate].push(slotTime)
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; background: #f9fafb; padding: 30px; border-radius: 16px;">
        <h1 style="color: #2563eb;">✅ Appointment Confirmed!</h1>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 10px;"><b>Doctor:</b></td><td>${docData.name}</td></tr>
          <tr><td style="padding: 10px;"><b>Date:</b></td><td>${slotDate}</td></tr>
          <tr><td style="padding: 10px;"><b>Time:</b></td><td>${slotTime}</td></tr>
          <tr><td style="padding: 10px;"><b>Fee:</b></td><td>₹${docData.fees}</td></tr>
        </table>
      </div>
    `

    await sendEmail(userData.email, '✅ Appointment Confirmed', emailHtml)

    res.json({ success: true, message: 'Appointment booked successfully! 🎉' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const listAppointments = async (req, res) => {
  try {
    const { userId } = req.body
    const appointments = await appointmentModel.find({ userId })
    res.json({ success: true, appointments })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: 'Unauthorized' })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    const { docId, slotDate, slotTime } = appointmentData
    const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked || {}
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({ success: true, message: 'Appointment cancelled' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const createPaymentIntent = async (req, res) => {
  try {
    const stripePackage = require('stripe')
    const stripe = stripePackage(process.env.STRIPE_SECRET_KEY)
    const { amount } = req.body
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'inr',
    })
    res.json({ success: true, clientSecret: paymentIntent.client_secret })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
  createPaymentIntent
}