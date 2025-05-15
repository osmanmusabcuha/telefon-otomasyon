import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Üst Menü */}
      <Navbar />

      {/* Sayfa İçeriği */}
      <main className="flex-grow p-4">
        <Outlet />
      </main>

      {/* Alt Menü */}
      <Footer />
    </div>
  );
}
