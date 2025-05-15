import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      console.log("Token:", token);
      console.log("Kullanıcı:", user);

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);  // Rolü de sakla istersen

      // 🔀 Rol bazlı yönlendirme
      if (user.role === 'admin') {
        navigate('/admin/users');
      } else if (user.role === 'employee') {
        navigate('/dashboard');
      } else if (user.role === 'customer') {
        navigate('/customer');
      } else {
        setErrorMessage('Bilinmeyen kullanıcı rolü!');
      }

    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Sunucu hatası! Lütfen tekrar deneyin.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Giriş Yap</h2>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
}
