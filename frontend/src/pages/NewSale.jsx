import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function NewSale() {
  const [customers, setCustomers] = useState([]);
  const [phones, setPhones] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedImei, setSelectedImei] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Müşterileri getir
    axios.get('http://localhost:5000/api/users/customers', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setCustomers(res.data.customers))
      .catch(err => console.error("Müşteri listesi alınamadı:", err));

    // Tüm uygun telefonları getir
    axios.get('http://localhost:5000/api/phones/available/structured', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPhones(res.data.phones))
      .catch(err => console.error("Telefon listesi alınamadı:", err));
  }, []);

  // Seçilen IMEI'ye göre fiyatı bul
  useEffect(() => {
    const selectedPhone = phones.find(p =>
      p.brand === selectedBrand &&
      p.model === selectedModel &&
      p.imei === selectedImei
    );
    if (selectedPhone) {
      setPrice(selectedPhone.price);
    } else {
      setPrice('');
    }
  }, [selectedImei, selectedModel, selectedBrand, phones]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const selectedPhone = phones.find(
        p => p.brand === selectedBrand && p.model === selectedModel && p.imei === selectedImei
      );

      if (!selectedPhone || !selectedCustomerId) {
        return setMessage("Lütfen müşteri ve tüm telefon detaylarını seçiniz.");
      }

      const res = await axios.post(
        'http://localhost:5000/api/sales',
        {
          phone_id: selectedPhone.id,
          customer_id: selectedCustomerId
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (res.data.success) {
        setMessage("✅ Satış başarıyla kaydedildi!");
        // Formu sıfırla
        setSelectedBrand('');
        setSelectedModel('');
        setSelectedImei('');
        setSelectedCustomerId('');
        setPrice('');
      } else {
        setMessage("❌ Satış yapılamadı.");
      }
    } catch (err) {
      console.error("Satış hatası:", err);
      setMessage("❌ Sunucu hatası oluştu.");
    }
  };

  // Unique brand/model/imei listesi
  const brands = [...new Set(phones.map(p => p.brand))];
  const models = phones.filter(p => p.brand === selectedBrand).map(p => p.model);
  const uniqueModels = [...new Set(models)];
  const imeis = phones.filter(p => p.brand === selectedBrand && p.model === selectedModel).map(p => p.imei);

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-2xl font-bold text-green-700 mb-4">🛒 Yeni Satış Oluştur</h2>

      {message && <p className="mb-4 text-center text-blue-700 font-semibold">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Müşteri seçimi */}
        <select
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Müşteri Seç</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} (ID: {c.id})
            </option>
          ))}
        </select>

        {/* Marka seçimi */}
        <select
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            setSelectedModel('');
            setSelectedImei('');
            setPrice('');
          }}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Marka Seç</option>
          {brands.map((b, i) => (
            <option key={i} value={b}>{b}</option>
          ))}
        </select>

        {/* Model seçimi */}
        <select
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value);
            setSelectedImei('');
            setPrice('');
          }}
          className="w-full p-2 border rounded"
          required
          disabled={!selectedBrand}
        >
          <option value="">Model Seç</option>
          {uniqueModels.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>

        {/* IMEI seçimi */}
        <select
          value={selectedImei}
          onChange={(e) => setSelectedImei(e.target.value)}
          className="w-full p-2 border rounded"
          required
          disabled={!selectedModel}
        >
          <option value="">IMEI Seç</option>
          {imeis.map((imei, i) => (
            <option key={i} value={imei}>{imei}</option>
          ))}
        </select>

        {/* Fiyat */}
        {price && (
          <div className="text-right text-lg font-semibold text-green-700">
            Fiyat: ₺{price}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Satışı Tamamla
        </button>
      </form>
    </div>
  );
}
