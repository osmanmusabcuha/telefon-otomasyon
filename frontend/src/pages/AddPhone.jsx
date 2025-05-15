import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddPhone() {
  const [brands, setBrands] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [models, setModels] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  const [imei, setImei] = useState("");
  const [price, setPrice] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Tüm marka/model verilerini backend'den al
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/external-phone/brand-models")
      .then((res) => {
        const data = res.data.data;

        // Tüm modelleri sakla
        setAllModels(data);

        // Marka listesini oluştur (benzersiz hale getir)
        const uniqueBrands = [...new Set(data.map((item) => item.Brand))];
        setBrands(uniqueBrands);
      })
      .catch((err) => {
        console.error("Marka/model verileri alınamadı:", err);
        setError("Marka/model verileri alınamadı.");
      });
  }, []);

  // Marka seçildiğinde modelleri filtrele
  useEffect(() => {
    if (!selectedBrand) {
      setModels([]);
      return;
    }

    const filtered = allModels.filter((m) => m.Brand === selectedBrand);
    const modelNames = [...new Set(filtered.map((m) => m.Model))];
    setModels(modelNames);
  }, [selectedBrand, allModels]);

  // Form gönder
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Lütfen giriş yapın.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/phones",
        {
          brand: selectedBrand,
          model: selectedModel,
          imei,
          price,
          warranty_period: warrantyPeriod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedBrand("");
      setSelectedModel("");
      setImei("");
      setPrice("");
      setWarrantyPeriod("");
      setError(null);
      setSuccessMessage("Telefon başarıyla eklendi!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error("Ekleme hatası:", err);
      setError("Telefon eklenemedi.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Telefon Ekle</h2>

      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Marka */}
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Marka Seç</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        {/* Model */}
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-2 border rounded"
          required
          disabled={!selectedBrand}
        >
          <option value="">Model Seç</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="IMEI"
          value={imei}
          onChange={(e) => setImei(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Fiyat"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Garanti Süresi (ay)"
          value={warrantyPeriod}
          onChange={(e) => setWarrantyPeriod(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Telefon Ekle
        </button>
      </form>
    </div>
  );
}
