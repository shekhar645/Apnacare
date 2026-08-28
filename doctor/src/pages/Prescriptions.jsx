import React, { useState } from "react";
import axios from "axios";

// NOTE: Replace 'backendUrl' and 'dToken' below with however your doctor app
// already stores them (likely from a DoctorContext). If you have a
// DoctorContext.jsx, import useContext and pull dToken + backendUrl from there
// instead of the placeholders below.

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Prescriptions = () => {
  const dToken = localStorage.getItem("dToken"); // change if stored differently

  const [formData, setFormData] = useState({
    appointmentId: "",
    userId: "",
    diagnosis: "",
    notes: "",
    medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
  });
  const [message, setMessage] = useState("");

  const handleMedChange = (index, field, value) => {
    const updated = [...formData.medicines];
    updated[index][field] = value;
    setFormData({ ...formData, medicines: updated });
  };

  const addMedicineRow = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { name: "", dosage: "", frequency: "", duration: "" },
      ],
    });
  };

  const removeMedicineRow = (index) => {
    setFormData({
      ...formData,
      medicines: formData.medicines.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/prescription/add`,
        formData,
        { headers: { dtoken: dToken } } // adjust header name if your authDoctor.js expects something else
      );

      if (data.success) {
        setMessage("✅ Prescription added successfully!");
        setFormData({
          appointmentId: "",
          userId: "",
          diagnosis: "",
          notes: "",
          medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
        });
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      setMessage("❌ Failed to add prescription");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px" }}>
      <h2>Add Prescription</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Appointment ID</label>
          <input
            type="text"
            value={formData.appointmentId}
            onChange={(e) =>
              setFormData({ ...formData, appointmentId: e.target.value })
            }
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Patient (User) ID</label>
          <input
            type="text"
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Diagnosis</label>
          <textarea
            value={formData.diagnosis}
            onChange={(e) =>
              setFormData({ ...formData, diagnosis: e.target.value })
            }
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <h4>Medicines</h4>
        {formData.medicines.map((med, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input
              placeholder="Name"
              value={med.name}
              onChange={(e) => handleMedChange(i, "name", e.target.value)}
              required
            />
            <input
              placeholder="Dosage"
              value={med.dosage}
              onChange={(e) => handleMedChange(i, "dosage", e.target.value)}
              required
            />
            <input
              placeholder="Frequency"
              value={med.frequency}
              onChange={(e) => handleMedChange(i, "frequency", e.target.value)}
              required
            />
            <input
              placeholder="Duration"
              value={med.duration}
              onChange={(e) => handleMedChange(i, "duration", e.target.value)}
              required
            />
            {formData.medicines.length > 1 && (
              <button type="button" onClick={() => removeMedicineRow(i)}>
                X
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addMedicineRow}>
          + Add Medicine
        </button>

        <div style={{ marginTop: "10px" }}>
          <label>Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button type="submit" style={{ marginTop: "15px", padding: "10px 20px" }}>
          Save Prescription
        </button>
      </form>
    </div>
  );
};

export default Prescriptions;