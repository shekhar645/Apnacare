const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const connectCloudinary = require('./config/cloudinary')
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const doctorRoutes = require('./routes/doctorRoutes')

dotenv.config()
connectDB()
connectCloudinary()

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/doctor', doctorRoutes)

app.get('/', (req, res) => {
  res.send('ApnaCare API is running ✅')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`ApnaCare server running on port ${PORT}`)
})