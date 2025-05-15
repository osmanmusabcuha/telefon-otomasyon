import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Dashboard from '../pages/Dashboard';
import PhoneList from '../pages/PhoneList';
import AddPhone from '../pages/AddPhone';
import EditPhone from '../pages/EditPhone';
import SalesList from '../pages/SalesList';
import NewSale from '../pages/NewSale';
import RepairForm from '../pages/ReapirForm';
import UserManagement from '../pages/UserManagment';
import PrivateRoute from './PrivateRoute';
import MainLayout from '../layouts/MainLayout';
import ImeiSearch from "../pages/ImeiSearch";
import ReturnPage from "../pages/ReturnPage";
import CustomerDashboard from '../pages/CustomerDashboard';
import RepairPage from '../pages/RepairPage';



export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      

      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/phones" element={<PhoneList />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/phones/add" element={<AddPhone />} />
          <Route path="/phones/:id/edit" element={<EditPhone />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/sales" element={<SalesList />} />
          <Route path="/sales/new" element={<NewSale />} />
          <Route path="/repair" element={<RepairForm />} />
          <Route path="/imei-search" element={<ImeiSearch />} />
          <Route path="/returns" element={<ReturnPage />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/repairpage" element={<RepairPage/>} />


        </Route>
      </Route>
    </Routes>
  );
}
