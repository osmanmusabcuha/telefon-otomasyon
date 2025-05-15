import React, { useState } from "react";
import axios from "axios";

export default function PhoneSearch() {
  const [imei, setImei] = useState(""); // Kullanıcının girdiği IMEI
  const [phone, setPhone] = useState(null); // Telefon bilgilerini tutacak state
  const [error, setError] = useState(null); // Hata mesajı

  // IMEI'ye göre telefon arama
  const handleSearch = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Token'ı localStorage'dan al

    if (imei && token) {
      try {
        const response = await axios.get(`http://localhost:5000/api/phones/${imei}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer token ile istek gönderiyoruz
          },
        });

        console.log(response.data); // Gelen telefonu kontrol et
        setPhone(response.data.phone); // Gelen telefonu state'e kaydet
        setError(null); // Hata durumunu sıfırla
      } catch (error) {
        console.error("Error fetching phone by IMEI:", error);
        setError("IMEI ile telefon bulunamadı.");
        setPhone(null); // Hata durumunda telefon bilgilerini sıfırla
      }
    } else {
      setError("Lütfen geçerli bir IMEI girin ve giriş yapın.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Telefon Ara</h2>
      {error && <p className="text-red-500">{error}</p>} {/* Hata mesajı */}

      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="IMEI"
          value={imei}
          onChange={(e) => setImei(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Telefon Ara
        </button>
      </form>

      {phone ? (
        <div className="mt-4">
          <h3 className="font-bold text-lg">Telefon Bilgileri</h3>
          <p><strong>Marka:</strong> {phone.brand}</p>
          <p><strong>Model:</strong> {phone.model}</p>
          <p><strong>Price:</strong> {phone.price}<strong> TL</strong></p>
          <p><strong>IMEI:</strong> {phone.imei} </p>
          <p><strong>Durum:</strong> {phone.status}</p>
          <p><strong>Eklenme Tarihi:</strong> {new Date(phone.created_at).toLocaleDateString()}</p>
          {phone.saleInfo && (
            <div>
              <h4 className="font-bold text-md">Satış Bilgileri</h4>
              <p><strong>Müşteri:</strong> {phone.saleInfo.customer_name}</p>
              <p><strong>Müşteri Telefonu:</strong> {phone.saleInfo.customer_phone}</p>
              <p><strong>Çalışan:</strong> {phone.saleInfo.employee_name}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center mt-4">Telefon bilgisi burada görüntülenecek.</p>
      )}
    </div>
  );
}
