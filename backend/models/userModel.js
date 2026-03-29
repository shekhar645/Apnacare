const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: '0000000000'
  },
  address: {
    type: Object,
    default: { line1: '', line2: '' }
  },
  gender: {
    type: String,
    default: 'Not Selected'
  },
  dob: {
    type: String,
    default: 'Not Selected'
  },
  image: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
  }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)