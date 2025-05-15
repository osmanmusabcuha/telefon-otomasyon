import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error('Kullanıcılar alınamadı:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Kullanıcı verisi:", res.data.users); // 👈 burada kontrol et
      setUsers(res.data.users);
    } catch (err) {
      console.error("Kullanıcılar alınamadı:", err);
    }
  };
  fetchUsers();
}, []);


  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Kullanıcı eklendi');
      setForm({ name: '', email: '', password: '', role: 'employee' });
      fetchUsers();
    } catch (err) {
      setMessage('❌ Hata oluştu');
      console.error(err);
    }
  };

  const handleDeactive = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/deactivate/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Pasifleştirme başarısız.');
    }
  };

  const handleActivate = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/activate/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Aktifleştirme başarısız.');
    }
  };

  const activeUsers = users.filter((u) => u.status === 'active');
  const inactiveUsers = users.filter((u) => u.status === 'inactive');

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">👥 Kullanıcı Yönetimi</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Ad Soyad"
          value={form.name}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-posta"
          value={form.email}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          value={form.password}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <select name="role" value={form.role} onChange={handleChange} className="p-2 border rounded">
          <option value="employee">Employee</option>
          <option value="customer">Customer</option>
        </select>
        <button type="submit" className="md:col-span-4 bg-green-600 text-white py-2 rounded hover:bg-green-700">
          ➕ Kullanıcı Ekle
        </button>
      </form>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Ad</th>
            <th className="border px-2 py-1">E-posta</th>
            <th className="border px-2 py-1">Rol</th>
            <th className="border px-2 py-1">Durum</th>
            <th className="border px-2 py-1">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {[...activeUsers, ...inactiveUsers].map((user) => (
            <tr
              key={user.id}
              className={`border-b ${user.status === 'inactive' ? 'bg-gray-100 text-gray-500' : ''}`}
            >
              <td className="border px-2 py-1">{user.name}</td>
              <td className="border px-2 py-1">{user.email}</td>
              <td className="border px-2 py-1 text-center">{user.role}</td>
              <td className="border px-2 py-1 text-center">{user.status}</td>
              <td className="border px-2 py-1 text-center space-x-2">
                {user.role !== 'admin' ? (
                  <>
                    <button
                      onClick={() => handleDeactive(user.id)}
                      disabled={user.status === 'inactive'}
                      className={`px-2 py-1 rounded ${
                        user.status === 'inactive'
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      Pasifleştir
                    </button>
                    <button
                      onClick={() => handleActivate(user.id)}
                      disabled={user.status === 'active'}
                      className={`px-2 py-1 rounded ${
                        user.status === 'active'
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Aktif Et
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400 italic">Admin</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
