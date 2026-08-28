require('dotenv').config()

const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const connectCloudinary = require('./config/cloudinary')
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const doctorRoutes = require('./routes/doctorRoutes')
const prescriptionRouter = require('./routes/prescriptionRoutes')

connectDB()
connectCloudinary()

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'atoken', 'dtoken']
}))

app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/doctor', doctorRoutes)
app.use("/api/prescription", prescriptionRouter);

app.get('/', (req, res) => {
  res.send('ApnaCare API is running ✅')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`ApnaCare server running on port ${PORT}`)
})