import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const isLoggedIn = localStorage.getItem("token"); // örnek kontrol
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}
