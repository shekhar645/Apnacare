const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true },
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  diagnosis: { type: String, default: "" },
  medicines: [
    {
      name: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true },
    },
  ],
  notes: { type: String, default: "" },
  date: { type: Number, default: Date.now },
});

const prescriptionModel =
  mongoose.models.prescription ||
  mongoose.model("prescription", prescriptionSchema);

module.exports = prescriptionModel;