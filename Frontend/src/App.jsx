import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

import Dashboard from './components/Admin/Dashboard';
import UserManagement from './components/Admin/UserManagement';
import StoreManagement from './components/Admin/StoreManagement';
import AdminLayout from './components/Admin/AdminLayout';
import StoreList from './components/User/StoreList';

import StoreOwnerDashboard from './components/Owner/StoreOwnerDashboard';
const Unauthorized = () => <div style={{ padding: '20px', color: 'red' }}><h2>Unauthorized</h2><p>You do not have permission to view this page.</p></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin Routes - with sidebar layout */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/stores" element={<StoreManagement />} />
            </Route>
          </Route>

          {/* Store Owner Routes */}
          <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
            <Route path="/store-owner" element={<Navigate to="/store-owner/dashboard" replace />} />
            <Route path="/store-owner/dashboard" element={<StoreOwnerDashboard />} />
          </Route>

          {/* Normal User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/stores" element={<StoreList />} />
          </Route>
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
