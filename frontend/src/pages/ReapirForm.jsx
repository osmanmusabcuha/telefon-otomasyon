import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RepairForm() {
  const [phones, setPhones] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedImei, setSelectedImei] = useState('');
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [repairFee, setRepairFee] = useState('');    // 🔧 Yeni state
  const [phonePrice, setPhonePrice] = useState('');  // Telefon fiyatını göstermek için
  const [customerId, setCustomerId] = useState('');
  const [message, setMessage] = useState('');

  // Satılmış telefonları çekiyoruz
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/phones/sold/structured', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPhones(res.data.phones))
    .catch(err => console.error("Telefon listesi alınamadı:", err));
  }, []);

  // Seçimler değiştiğinde fiyat ve customerId'yi doldur
  useEffect(() => {
    const selectedPhone = phones.find(
      p => p.brand === selectedBrand && p.model === selectedModel && p.imei === selectedImei
    );
    if (selectedPhone) {
      setPhonePrice(selectedPhone.price);
      setCustomerId(selectedPhone.customer_id);
    } else {
      setPhonePrice('');
      setCustomerId('');
    }
  }, [selectedBrand, selectedModel, selectedImei, phones]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const phone = phones.find(
      p => p.brand === selectedBrand && p.model === selectedModel && p.imei === selectedImei
    );
    if (!phone || !customerId) {
      return setMessage("Lütfen geçerli bir IMEI seçin.");
    }
    if (!repairFee) {
      return setMessage("Lütfen tamir ücretini girin.");
    }

    try {
      const res = await axios.post('http://localhost:5000/api/repairs', {
        phone_id: phone.id,
        customer_id: customerId,
        issue_type: issueType,
        description,
        repair_fee: Number(repairFee)
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.data.success) {
        setMessage("✅ Tamir kaydı başarıyla oluşturuldu!");
        // Reset
        setSelectedBrand('');
        setSelectedModel('');
        setSelectedImei('');
        setIssueType('');
        setDescription('');
        setRepairFee('');
        setPhonePrice('');
        setCustomerId('');
      } else {
        setMessage("❌ Kayıt başarısız.");
      }
    } catch (err) {
      console.error("Tamir hatası:", err);
      setMessage("❌ Sunucu hatası.");
    }
  };

  // Dropdown verileri
  const brands = [...new Set(phones.map(p => p.brand))];
  const models = brands.includes(selectedBrand)
    ? [...new Set(phones.filter(p => p.brand === selectedBrand).map(p => p.model))]
    : [];
  const imeis = models.includes(selectedModel)
    ? phones.filter(p => p.brand === selectedBrand && p.model === selectedModel).map(p => p.imei)
    : [];

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-yellow-700 mb-6">🔧 Tamir Kabul</h2>

      {message && <p className="text-green-600 font-medium mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Marka Seçimi */}
        <select
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            setSelectedModel('');
            setSelectedImei('');
          }}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Marka Seç</option>
          {brands.map((b, i) => (
            <option key={i} value={b}>{b}</option>
          ))}
        </select>

        {/* Model Seçimi */}
        <select
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value);
            setSelectedImei('');
          }}
          className="w-full p-2 border rounded"
          required
          disabled={!selectedBrand}
        >
          <option value="">Model Seç</option>
          {models.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>

        {/* IMEI Seçimi */}
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

        {/* Telefon Fiyatı */}
        {phonePrice && (
          <div className="text-right text-green-700 font-medium">
            Telefon Fiyatı: ₺{phonePrice}
          </div>
        )}

        {/* Sorun Tipi */}
        <select
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Sorun Türü Seç</option>
          <option value="Ekran Sorunu">Ekran Sorunu</option>
          <option value="Batarya Sorunu">Batarya Sorunu</option>
          <option value="Yazılım Problemi">Yazılım Problemi</option>
          <option value="Diğer">Diğer</option>
        </select>

        {/* Açıklama */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded h-24"
          placeholder="Detaylı Açıklama"
          required
        />

        {/* Tamir Ücreti */}
        <input
          type="number"
          placeholder="Tamir Ücreti (₺)"
          value={repairFee}
          onChange={(e) => setRepairFee(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"
        >
          Tamir Kaydını Oluştur
        </button>
      </form>
    </div>
  );
}
