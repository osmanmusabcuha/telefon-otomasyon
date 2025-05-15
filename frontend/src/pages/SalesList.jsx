import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SalesList() {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/sales', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSales(res.data.sales);
      } catch (err) {
        setError('Satışlar alınamadı');
        console.error(err);
      }
    };

    fetchSales();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded mt-8">
      <h2 className="text-2xl font-bold text-green-700 mb-4">📋 Satış Listesi</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Müşteri</th>
              <th className="border px-3 py-2">Telefon</th>
              <th className="border px-3 py-2">Satış Tarihi</th>
              <th className="border px-3 py-2">Ödeme</th>
              <th className="border px-3 py-2">Teslimat</th>
              <th className="border px-3 py-2">Çalışan</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-t">
                <td className="border px-3 py-2">{sale.customer_name}</td>
                <td className="border px-3 py-2">{sale.brand} {sale.model}</td>
                <td className="border px-3 py-2">{new Date(sale.sale_date).toLocaleDateString()}</td>
                <td className="border px-3 py-2">{sale.payment_status}</td>
                <td className="border px-3 py-2">{sale.delivery_status}</td>
                <td className="border px-3 py-2">{sale.employee_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
