import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CustomerDashboard() {
  const [sales, setSales] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [returns, setReturns] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const customerId = JSON.parse(atob(token.split('.')[1])).id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, repairsRes, returnsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/sales/customer/${customerId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:5000/api/repairs/customer/${customerId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:5000/api/returns/customer/${customerId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);

        setSales(salesRes.data.sales || []);
        setRepairs(repairsRes.data.repairs || []);
        setReturns(returnsRes.data.returns || []);
      } catch (err) {
        console.error(err);
        setError('Veriler alınamadı');
      }
    };

    fetchData();
  }, [customerId]);

  const Card = ({ title, icon, color, data, children }) => (
    <div className="bg-white shadow rounded-lg p-4 border mb-6">
      <h3 className={`text-xl font-bold flex items-center gap-2 mb-3 ${color}`}>
        {icon} {title}
      </h3>
      {data.length > 0 ? (
        <ul className="list-disc list-inside text-gray-700">{children}</ul>
      ) : (
        <p className="text-gray-400 italic">Kayıt bulunamadı.</p>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-8">👤 Müşteri Paneli</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <Card title="Satın Aldığınız Telefonlar" icon="🛒" color="text-green-700" data={sales}>
        {sales.map((s) => (
          <li key={s.id}>
            <span className="font-medium">{s.brand} {s.model}</span> – Satın alma tarihi:{" "}
            <span className="text-gray-500">{new Date(s.sale_date).toLocaleDateString()}</span>
          </li>
        ))}
      </Card>

      <Card title="Tamirdeki Cihazlar" icon="🔧" color="text-yellow-700" data={repairs}>
        {repairs.map((r) => (
          <li key={r.id}>
            <span className="font-medium">{r.issue_type}</span> –{" "}
            <span className="text-gray-500">{r.status || 'beklemede'}</span>
          </li>
        ))}
      </Card>

      <Card title="İade İşlemleri" icon="🔁" color="text-red-700" data={returns}>
        {returns.map((r) => (
          <li key={r.id}>
            {r.reason} –{" "}
            <span className="text-gray-500">{r.return_status}</span>
          </li>
        ))}
      </Card>
    </div>
  );
}
