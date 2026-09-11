import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/users',     label: 'Users',     icon: '👥' },
  { to: '/admin/stores',    label: 'Stores',    icon: '🏪' },
];

const AdminLayout = () => {
  return (
    <div className="layout-wrapper">
      <Navbar links={adminLinks} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
