import React, { useState } from 'react';
import axios from 'axios';

export default function RegisterCustomer() {
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    password: '',  // Şifre alanını ekledik
    status: 'active', // Varsayılan olarak aktif müşteri
    role: 'customer', 
  });
  const [message, setMessage] = useState('');

  // Form inputlarını güncelleme
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Formu gönderme
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // Token'ı localStorage'dan al

      // Müşteri kaydını backend'e gönderiyoruz
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: form.customerName,
        email: form.email,
        password: form.password,  // Şifreyi de gönderiyoruz
        phone: form.phone,
        role : form.role
      },
      {
            headers: {
              Authorization: `Bearer ${token}`, // Bearer token ile istek gönderiyoruz
            },
          }
    );

      // Müşteri başarılı bir şekilde kaydedildiyse
      if (response.data.success) {
        setMessage('Müşteri başarıyla kaydedildi!');
        setForm({ customerName: '', email: '', phone: '', address: '', password: '', status: 'active' }); // Formu sıfırlıyoruz
      }
    } catch (error) {
      setMessage('Sunucu hatası, lütfen tekrar deneyin.');
      console.error('Müşteri kaydetme hatası:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-2xl font-bold text-green-700 mb-4">👤 Yeni Müşteri Kaydı</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="customerName"
          placeholder="Müşteri Adı"
          value={form.customerName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Müşteri E-posta"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Telefon Numarası"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
       
        <input
          type="text"
          name="address"
          placeholder="Adres"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
         
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Müşteri Kaydet
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
}
