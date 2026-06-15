import React from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout'; // Layout bao quanh (Navbar, Footer)
import OwnerLayout from '../layouts/OwnerLayout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../pages/Customer/Home/Home';
import Hotels from '../pages/Customer/Hotels/Hotels';
import Auth from '../pages/Auth/Auth';
import HotelDetail from '../pages/Customer/HotelDetail/HotelDetail';
import Booking from '../pages/Customer/Booking/Booking';
import Reels from '../pages/Customer/Reels/Reels';
import Profile from '../pages/Customer/Profile/Profile';
import OwnerDashboard from '../pages/Owner/Dashboard/Dashboard';
import ManageHotels from '../pages/Owner/ManageHotels/ManageHotels';
import ManageOrders from '../pages/Owner/ManageOrders/ManageOrders';
import ApproveHotel from '../pages/Admin/ApproveHotel/ApproveHotel';
import ManageUsers from '../pages/Admin/ManageUsers/ManageUsers';
import Promos from '../pages/Admin/Promos/Promos';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const location = useLocation();
  const { user, role, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  if (allowedRoles?.length && !allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="hotels" element={<Hotels />} />
        <Route path="hotel/:id" element={<HotelDetail />} />
        <Route path="booking" element={<Booking />} />
        <Route path="reels" element={<Reels />} />
        <Route path="profile" element={<ProtectedRoute allowedRoles={["Customer", "Owner", "Admin"]}><Profile /></ProtectedRoute>} />
        <Route path="auth" element={<Auth />} />
      </Route>
      <Route path="/owner" element={<ProtectedRoute allowedRoles={["Owner"]}><OwnerLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/owner/dashboard" replace />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="hotels" element={<ManageHotels />} />
        <Route path="orders" element={<ManageOrders />} />
      </Route>
      <Route path="/admin" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/approve-hotels" replace />} />
        <Route path="dashboard" element={<Navigate to="/admin/approve-hotels" replace />} />
        <Route path="profile" element={<Profile />} />
        <Route path="approve-hotels" element={<ApproveHotel />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="promos" element={<Promos />} />
      </Route>
    </Routes>
  );
};
export default AppRoutes;
