const express = require("express");
const {
  addPrescription,
  getUserPrescriptions,
  getDoctorPrescriptions,
  searchPrescriptions,
} = require("../controllers/prescriptionController");
const authUser = require("../middleware/authUser");
const authDoctor = require("../middleware/authDoctor");

const prescriptionRouter = express.Router();

// Doctor routes
prescriptionRouter.post("/add", authDoctor, addPrescription);
prescriptionRouter.get("/doctor-prescriptions", authDoctor, getDoctorPrescriptions);

// Patient routes
prescriptionRouter.get("/my-prescriptions", authUser, getUserPrescriptions);
prescriptionRouter.get("/search", authUser, searchPrescriptions);

module.exports = prescriptionRouter;