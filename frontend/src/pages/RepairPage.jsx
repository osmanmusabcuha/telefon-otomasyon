import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RepairPage() {
  const [repairs, setRepairs] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ⏬ Tamirdeki telefonları çek
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/repairs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const repairingPhones = res.data.repairs.filter(
          (r) => r.repair_status !== "completed"
        );
        setRepairs(repairingPhones);
      })
      .catch((err) => {
        console.error("Veriler alınamadı:", err);
        setError("Tamirdeki cihazlar yüklenemedi.");
      });
  }, []);

  // ⏫ Tamir durumunu güncelle
  const handleStatusUpdate = async (repairId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.patch(
        `http://localhost:5000/api/repairs/${repairId}`,
        { status: "completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRepairs((prev) =>
        prev.filter((r) => r.id !== repairId)
      );
      setSuccessMessage("Tamir durumu güncellendi!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Durum güncellenemedi:", err);
      setError("İşlem başarısız.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-yellow-700 mb-4">🔧 Tamirdeki Cihazlar</h2>

      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {repairs.length === 0 ? (
        <p>Şu anda tamirde cihaz bulunmuyor.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">IMEI</th>
              <th className="p-2 border">Müşteri</th>
              <th className="p-2 border">Sorun</th>
              <th className="p-2 border">Ücret</th>
              <th className="p-2 border">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {repairs.map((repair) => (
              <tr key={repair.id} className="text-center">
                <td className="p-2 border">{repair.imei}</td>
                <td className="p-2 border">{repair.customer_name}</td>
                <td className="p-2 border">{repair.issue_type}</td>
                <td className="p-2 border">{repair.repair_fee} ₺</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleStatusUpdate(repair.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Tamir Edildi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
