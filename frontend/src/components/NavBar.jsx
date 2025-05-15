import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">📱 Bayi Otomasyonu</h1>

      {token ? (
        <div className="space-x-4">
          {/* Admin için */}
          {role === 'admin' && (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              
              <Link to="/phones" className="hover:underline">Telefonlar</Link>
              <Link to="/sales" className="hover:underline">Satışlar</Link>
              <Link to="/register" className="hover:underline">Müşteri Kayıt</Link>
              <Link to="/admin/users" className="hover:underline">Kullanıcı Düzenleme</Link>
            </>
          )}

          {/* Employee için */}
          {role === 'employee' && (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/phones" className="hover:underline">Telefonlar</Link>
              <Link to="/sales" className="hover:underline">Satışlar</Link>
              <Link to="/repairpage" className="hover:underline">Tamirler</Link>
              <Link to="/register" className="hover:underline">Müşteri Kayıt</Link>
            </>
          )}

          {/* Customer için */}
          {role === 'customer' && (
            <>
              
            </>
          )}

          <button onClick={handleLogout} className="hover:underline">Çıkış</button>
        </div>
      ) : (
        <div className="space-x-4">
          <Link to="/login" className="hover:underline">Giriş</Link>
          <Link to="/register" className="hover:underline">Kayıt</Link>
        </div>
      )}
    </nav>
  );
}
