const userModel = require('../models/userModel')
const doctorModel = require('../models/doctorModel')
const appointmentModel = require('../models/appointmentModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const stripePackage = require('stripe')
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

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const exists = await userModel.findOne({ email })
    if (exists) return res.json({ success: false, message: 'User already exists' })
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new userModel({ name, email, password: hashedPassword })
    const user = await newUser.save()
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) return res.json({ success: false, message: 'User does not exist' })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.json({ success: false, message: 'Invalid password' })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })
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
    res.json({ success: true, message: 'Profile updated' })
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
    let slots_booked = docData.slots_booked
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Slot not available' })
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
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
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 30px; border-radius: 16px;">
        <div style="background: #2563eb; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">✅ Appointment Confirmed!</h1>
          <p style="color: #bfdbfe; margin: 8px 0 0 0;">ApnaCare Medical Services</p>
        </div>
        <div style="background: white; padding: 24px; border-radius: 12px; margin-bottom: 16px;">
          <h2 style="color: #1e40af; margin-top: 0;">Hello, ${userData.name}! 👋</h2>
          <p style="color: #4b5563;">Your appointment has been successfully booked.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr style="background: #eff6ff;">
              <td style="padding: 12px; color: #6b7280; font-weight: bold;">👨‍⚕️ Doctor</td>
              <td style="padding: 12px; color: #1f2937; font-weight: bold;">${docData.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px; color: #6b7280; font-weight: bold;">🏥 Speciality</td>
              <td style="padding: 12px; color: #1f2937;">${docData.speciality}</td>
            </tr>
            <tr style="background: #eff6ff;">
              <td style="padding: 12px; color: #6b7280; font-weight: bold;">📅 Date</td>
              <td style="padding: 12px; color: #1f2937;">${slotDate}</td>
            </tr>
            <tr>
              <td style="padding: 12px; color: #6b7280; font-weight: bold;">⏰ Time</td>
              <td style="padding: 12px; color: #1f2937;">${slotTime}</td>
            </tr>
            <tr style="background: #eff6ff;">
              <td style="padding: 12px; color: #6b7280; font-weight: bold;">💰 Fees</td>
              <td style="padding: 12px; color: #1f2937; font-weight: bold;">₹${docData.fees}</td>
            </tr>
          </table>
        </div>
        <div style="text-align: center; color: #9ca3af; font-size: 13px;">
          <p>Thank you for choosing ApnaCare 💙</p>
        </div>
      </div>
    `
    await sendEmail(userData.email, '✅ Appointment Confirmed - ApnaCare', emailHtml)
    res.json({ success: true, message: 'Appointment booked successfully' })
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
      return res.json({ success: false, message: 'Unauthorized action' })
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
    const { docId, slotDate, slotTime } = appointmentData
    const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    res.json({ success: true, message: 'Appointment cancelled' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const createPaymentIntent = async (req, res) => {
  try {
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