import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = ({ links = [] }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="navbar-brand">
          <span className="navbar-logo">⭐</span>
          <span className="navbar-title">RatePlatform</span>
        </div>

        {/* Nav Links */}
        <div className="navbar-links">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
        </div>

        {/* User Info + Logout */}
        <div className="navbar-right">
          <span className="navbar-user">
            <span className="navbar-avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
            <span className="navbar-username">{user?.name || user?.email}</span>
          </span>
          <button className="navbar-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
