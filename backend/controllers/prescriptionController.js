const prescriptionModel = require("../models/prescriptionModel");

// Doctor creates a prescription for an appointment
const addPrescription = async (req, res) => {
  try {
    const { appointmentId, userId, diagnosis, medicines, notes } = req.body;
    const docId = req.body.docId; // set by authDoctor middleware

    if (!appointmentId || !userId || !medicines || medicines.length === 0) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const prescriptionData = {
      appointmentId,
      userId,
      docId,
      diagnosis,
      medicines,
      notes,
      date: Date.now(),
    };

    const newPrescription = new prescriptionModel(prescriptionData);
    await newPrescription.save();

    res.json({ success: true, message: "Prescription added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Patient views their own prescriptions
const getUserPrescriptions = async (req, res) => {
  try {
    const userId = req.body.userId; // set by authUser middleware

    const prescriptions = await prescriptionModel
      .find({ userId })
      .sort({ date: -1 });

    res.json({ success: true, prescriptions });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Doctor views prescriptions they created
const getDoctorPrescriptions = async (req, res) => {
  try {
    const docId = req.body.docId; // set by authDoctor middleware

    const prescriptions = await prescriptionModel
      .find({ docId })
      .sort({ date: -1 });

    res.json({ success: true, prescriptions });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Search prescriptions by medicine name or date (patient)
const searchPrescriptions = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { medicine, date } = req.query;

    let query = { userId };

    if (medicine) {
      query["medicines.name"] = { $regex: medicine, $options: "i" };
    }

    if (date) {
      const start = new Date(date).setHours(0, 0, 0, 0);
      const end = new Date(date).setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const prescriptions = await prescriptionModel.find(query).sort({ date: -1 });

    res.json({ success: true, prescriptions });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  addPrescription,
  getUserPrescriptions,
  getDoctorPrescriptions,
  searchPrescriptions,
};