import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import jsPDF from "jspdf";

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
        { headers: { token } }
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

  const downloadPDF = (p) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(0, 0, pageWidth, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("ApnaCare", 14, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Prescription", pageWidth - 14, 18, { align: "right" });

    // Body
    doc.setTextColor(0, 0, 0);
    let y = 42;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Date:", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${new Date(p.date).toLocaleDateString()}`, 40, y);

    if (p.doctorId?.name) {
      doc.setFont("helvetica", "bold");
      doc.text("Doctor:", pageWidth - 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(`Dr. ${p.doctorId.name}`, pageWidth - 55, y);
    }

    y += 10;
    doc.setDrawColor(220, 220, 220);
    doc.line(14, y, pageWidth - 14, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("Diagnosis:", 14, y);
    doc.setFont("helvetica", "normal");
    const diagnosisLines = doc.splitTextToSize(p.diagnosis || "N/A", pageWidth - 45);
    doc.text(diagnosisLines, 45, y);
    y += diagnosisLines.length * 6 + 8;

    doc.setFont("helvetica", "bold");
    doc.text("Medicines:", 14, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    p.medicines.forEach((m, i) => {
      doc.setFillColor(245, 247, 255);
      doc.rect(14, y - 5, pageWidth - 28, 8, "F");
      doc.text(
        `${i + 1}. ${m.name} — ${m.dosage}, ${m.frequency}, for ${m.duration}`,
        16,
        y
      );
      y += 10;
    });

    if (p.notes) {
      y += 4;
      doc.setFont("helvetica", "bold");
      doc.text("Notes:", 14, y);
      doc.setFont("helvetica", "normal");
      const notesLines = doc.splitTextToSize(p.notes, pageWidth - 45);
      doc.text(notesLines, 40, y);
      y += notesLines.length * 6;
    }

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "This is a digitally generated prescription from ApnaCare.",
      14,
      285
    );

    doc.save(`Prescription_${new Date(p.date).toLocaleDateString().replace(/\//g, "-")}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-1">My Prescriptions</h2>
      <p className="text-gray-500 mb-6">View and download your prescriptions</p>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 mb-8 bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
      >
        <input
          type="text"
          placeholder="Search medicine..."
          value={medicineSearch}
          onChange={(e) => setMedicineSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={dateSearch}
          onChange={(e) => setDateSearch(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all"
        >
          Search
        </button>
        <button
          type="button"
          onClick={clearSearch}
          className="px-5 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all"
        >
          Clear
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl block mb-3">💊</span>
          <p>No prescriptions found</p>
        </div>
      ) : (
        <div className="space-y-5">
          {prescriptions.map((p) => (
            <div
              key={p._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Date</p>
                  <p className="text-sm font-medium text-gray-800">
                    {new Date(p.date).toLocaleDateString()}
                  </p>
                </div>
                {p.doctorId?.name && (
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Doctor</p>
                    <p className="text-sm font-medium text-gray-800">Dr. {p.doctorId.name}</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Diagnosis</p>
                <p className="text-sm text-gray-700">{p.diagnosis || "N/A"}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Medicines</p>
                <div className="space-y-1.5">
                  {p.medicines.map((m, i) => (
                    <div
                      key={i}
                      className="text-sm bg-blue-50 text-blue-900 px-3 py-2 rounded-lg"
                    >
                      <span className="font-medium">{m.name}</span> — {m.dosage}, {m.frequency}, for {m.duration}
                    </div>
                  ))}
                </div>
              </div>

              {p.notes && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Notes</p>
                  <p className="text-sm text-gray-600">{p.notes}</p>
                </div>
              )}

              <button
                onClick={() => downloadPDF(p)}
                className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all"
              >
                ⬇ Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPrescriptions;