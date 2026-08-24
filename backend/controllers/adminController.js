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

const getDoctorSalaries = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password')
    const appointments = await appointmentModel.find({ isCompleted: true })

    const salaryData = doctors.map(doc => {
      const docAppointments = appointments.filter(a => a.docId === doc._id.toString())
      const totalEarned = docAppointments.reduce((sum, a) => sum + a.amount, 0)
      const adminShare = Math.round(totalEarned * 0.2)
      const doctorSalary = Math.round(totalEarned * 0.8)

      return {
        _id: doc._id,
        name: doc.name,
        speciality: doc.speciality,
        image: doc.image,
        fees: doc.fees,
        totalAppointments: docAppointments.length,
        totalEarned,
        adminShare,
        doctorSalary,
        salaryHistory: doc.salaryHistory || []
      }
    })

    res.json({ success: true, salaryData })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const paySalary = async (req, res) => {
  try {
    const { docId, amount, month, appointments } = req.body
    const doctor = await doctorModel.findById(docId)
    if (!doctor) return res.json({ success: false, message: 'Doctor not found' })

    const salaryEntry = {
      month,
      amount: Number(amount),
      paidOn: new Date(),
      appointments: Number(appointments)
    }

    await doctorModel.findByIdAndUpdate(docId, {
      $push: { salaryHistory: salaryEntry },
      $inc: { salary: Number(amount) }
    })

    res.json({ success: true, message: `Salary of ₹${amount} paid to ${doctor.name}` })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

module.exports = {
  addDoctor, adminLogin, allDoctors, allAppointments,
  cancelAppointment, completeAppointment, changeAvailability,
  getDashboard, getDoctorSalaries, paySalary
}