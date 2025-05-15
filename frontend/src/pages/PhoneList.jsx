import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PhoneList() {
  const [phones, setPhones] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState(null);

  // Telefonları getir
  useEffect(() => {
    const fetchPhones = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await axios.get("http://localhost:5000/api/phones", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setPhones(response.data.phones);
        } catch (error) {
          console.error("Telefonlar alınırken hata:", error);
          setError("Telefonları alırken bir hata oluştu.");
        }
      } else {
        setError("Token bulunamadı. Lütfen giriş yapın.");
      }
    };

    fetchPhones();
  }, []);

  // Duruma göre filtrele
  const filteredPhones =
    filterStatus === "all"
      ? phones
      : phones.filter((phone) => phone.status === filterStatus);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Telefon Listesi</h2>

      {/* Filtre Dropdown */}
      <div className="mb-4">
        <label className="font-semibold mr-2">Duruma Göre Filtrele:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">Tümü</option>
          <option value="available">Stokta</option>
          <option value="sold">Satıldı</option>
          <option value="repairing">Tamirde</option>
          <option value="returned">İade</option>
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <table className="min-w-full border border-gray-300">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Marka</th>
            <th className="px-4 py-2 text-left">Model</th>
            <th className="px-4 py-2 text-left">IMEI</th>
            <th className="px-4 py-2 text-left">Durum</th>
            <th className="px-4 py-2 text-left">Eklenme Tarihi</th>
          </tr>
        </thead>
        <tbody>
          {filteredPhones.length > 0 ? (
            filteredPhones.map((phone) => (
              <tr key={phone.id} className="border-b">
                <td className="px-4 py-2">{phone.brand}</td>
                <td className="px-4 py-2">{phone.model}</td>
                <td className="px-4 py-2">{phone.imei}</td>
                <td className="px-4 py-2">{phone.status}</td>
                <td className="px-4 py-2">
                  {new Date(phone.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-2 text-center">
                Telefon bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
