const express = require('express')
const router = express.Router()
const { doctorList } = require('../controllers/doctorController')

router.get('/list', doctorList)

module.exports = router