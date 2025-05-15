
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [plist, setPList] = useState([]);
  const [error, setError] = useState(null);
  const [todayTotal, setTodayTotal] = useState(0);
  const [todaySalesCount, setTodaySalesCount] = useState(0);
    const [repairingCount, setRepairingCount] = useState(0);  // Repairing count state'i
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
        console.log(response.data);
        setPList(response.data.phones);
        const count = response.data.phones.filter(phone => phone.status === 'repairing').length;
        setRepairingCount(count);
        console.log(repairingCount);

      } catch (error) {
        console.error("Error fetching phones:", error);
        setError(`Telefonları alırken bir hata oldu: ${error.message}`);
      }
    } else {
      setError("Token bulunamadı.");
    }
  };

  fetchPhones();
}, []);

useEffect(() => {
  const token = localStorage.getItem("token");

  const fetchTodaySales = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sales/today-count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setTodaySalesCount(res.data.count);
    } catch (err) {
      console.error("Bugünkü satışlar alınamadı:", err);
    }
  };

  fetchTodaySales();
}, []);
useEffect(() => {
  const token = localStorage.getItem("token");

  const fetchTodayTotal = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sales/today-total', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setTodayTotal(res.data.total_amount);
    } catch (err) {
      console.error("Bugünkü satış tutarı alınamadı:", err);
    }
  };

  fetchTodayTotal();
}, []);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-700">📱 Bayi Otomasyon Dashboard</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold text-gray-700">🛒 Bugünkü Satışlar</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">{todayTotal} satış</p>

        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold text-gray-700">📦 Stoktaki Telefonlar</h3>
          
          <p className="text-2xl font-bold text-green-600 mt-2"> {plist.length}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold text-gray-700">🔧 Bekleyen Tamir İşlemleri</h3>
        
        <p className="text-2xl font-bold text-green-600 mt-2">{repairingCount} cihaz işlem bekliyor</p>
      </div>

      

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => navigate("/sales/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Satış Yap
        </button>

        <button
          onClick={() => navigate("/repair")}
          className="bg-yellow-600 text-white px-4 py-2 rounded"
        >
          🔧 Tamir Kabul
        </button>
        <button
  onClick={() => navigate("/imei-search")}
  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
>
  🔍 IMEI Sorgula
</button>
<button
  onClick={() => navigate("/returns")}
  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
>
  📤 İade Al
</button>

        <button
          onClick={() => navigate("/phones/add")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          📱 Telefon Ekle
        </button>
      </div>
    </div>
  );
}
