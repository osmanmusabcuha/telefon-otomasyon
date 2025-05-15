import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ReturnPage() {
  const [phones, setPhones] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedImei, setSelectedImei] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0]);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Tüm satılmış telefonları çek
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("http://localhost:5000/api/phones/sold/structured", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPhones(res.data.phones))
      .catch(err => {
        console.error("Satılmış telefonlar alınamadı:", err);
        setError("Satılmış telefon verisi alınamadı.");
      });
  }, []);

  // Telefon seçimiyle ilgili yardımcılar
  const brands = [...new Set(phones.map(p => p.brand))];
  const models = phones.filter(p => p.brand === selectedBrand).map(p => p.model);
  const uniqueModels = [...new Set(models)];
  const imeis = phones.filter(p => p.brand === selectedBrand && p.model === selectedModel).map(p => p.imei);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) return setError("Giriş yapmanız gerekiyor.");

    const phone = phones.find(
      p => p.brand === selectedBrand && p.model === selectedModel && p.imei === selectedImei
    );
    console.log("Seçilen telefon:", phone);
console.log("Telefon status:", phone?.status);

    if (!phone || phone.status !== "sold") {
      return setError("Bu telefon iade edilemez.");
    }

    try {
      await axios.post(
        "http://localhost:5000/api/returns",
        {
          phone_id: phone.id,
          customer_id: phone.customer_id,
          reason: returnReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setMessage("✅ İade işlemi başarıyla kaydedildi!");
      setSelectedBrand('');
      setSelectedModel('');
      setSelectedImei('');
      setReturnReason('');
      setReturnDate(new Date().toISOString().split("T")[0]);
    } catch (err) {
      console.error("İade hatası:", err);
      setError("İade işlemi sırasında hata oluştu.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-red-600 mb-4">📤 İade Al</h2>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Marka Seçimi */}
        <select value={selectedBrand} onChange={(e) => {
          setSelectedBrand(e.target.value);
          setSelectedModel('');
          setSelectedImei('');
        }} className="w-full p-2 border rounded" required>
          <option value="">Marka Seç</option>
          {brands.map((b, i) => <option key={i} value={b}>{b}</option>)}
        </select>

        {/* Model Seçimi */}
        <select value={selectedModel} onChange={(e) => {
          setSelectedModel(e.target.value);
          setSelectedImei('');
        }} className="w-full p-2 border rounded" required disabled={!selectedBrand}>
          <option value="">Model Seç</option>
          {uniqueModels.map((m, i) => <option key={i} value={m}>{m}</option>)}
        </select>

        {/* IMEI Seçimi */}
        <select value={selectedImei} onChange={(e) => setSelectedImei(e.target.value)}
                className="w-full p-2 border rounded" required disabled={!selectedModel}>
          <option value="">IMEI Seç</option>
          {imeis.map((imei, i) => <option key={i} value={imei}>{imei}</option>)}
        </select>

        {/* Sebep */}
        <textarea
          name="returnReason"
          placeholder="İade Sebebi"
          value={returnReason}
          onChange={(e) => setReturnReason(e.target.value)}
          className="w-full p-2 border rounded h-24"
          required
        />

        {/* Tarih */}
        <input
          type="date"
          name="returnDate"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          İade İşlemini Kaydet
        </button>
      </form>
    </div>
  );
}
