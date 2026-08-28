import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const MyPrescriptions = () => {
  const { token, backendUrl } = useContext(AppContext);

  const [prescriptions, setPrescriptions] = useState([]);
  const [medicineSearch, setMedicineSearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/prescription/my-prescriptions`,
        { headers: { token } } // adjust header name if your authUser.js expects something else
      );
      if (data.success) setPrescriptions(data.prescriptions);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let url = `${backendUrl}/api/prescription/search?`;
      if (medicineSearch) url += `medicine=${medicineSearch}&`;
      if (dateSearch) url += `date=${dateSearch}`;

      const { data } = await axios.get(url, { headers: { token } });
      if (data.success) setPrescriptions(data.prescriptions);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setMedicineSearch("");
    setDateSearch("");
    fetchPrescriptions();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Prescriptions</h2>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search medicine..."
          value={medicineSearch}
          onChange={(e) => setMedicineSearch(e.target.value)}
        />
        <input
          type="date"
          value={dateSearch}
          onChange={(e) => setDateSearch(e.target.value)}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={clearSearch}>Clear</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : prescriptions.length === 0 ? (
        <p>No prescriptions found</p>
      ) : (
        prescriptions.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <p><strong>Date:</strong> {new Date(p.date).toLocaleDateString()}</p>
            <p><strong>Diagnosis:</strong> {p.diagnosis || "N/A"}</p>
            <p><strong>Medicines:</strong></p>
            <ul>
              {p.medicines.map((m, i) => (
                <li key={i}>
                  {m.name} - {m.dosage}, {m.frequency}, for {m.duration}
                </li>
              ))}
            </ul>
            {p.notes && <p><strong>Notes:</strong> {p.notes}</p>}
          </div>
        ))
      )}
    </div>
  );
};

export default MyPrescriptions;