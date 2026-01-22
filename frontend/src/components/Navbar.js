import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiHome, FiPackage, FiUsers, FiShoppingCart, FiBox, FiUser, FiLogOut } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <h2>ERP System</h2>
        </Link>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <FiHome /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
              <FiPackage /> Products
            </Link>
          </li>
          <li>
            <Link to="/customers" onClick={() => setMobileMenuOpen(false)}>
              <FiUsers /> Customers
            </Link>
          </li>
          <li>
            <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
              <FiShoppingCart /> Orders
            </Link>
          </li>
          <li>
            <Link to="/inventory" onClick={() => setMobileMenuOpen(false)}>
              <FiBox /> Inventory
            </Link>
          </li>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <li>
              <Link to="/users" onClick={() => setMobileMenuOpen(false)}>
                <FiUser /> Users
              </Link>
            </li>
          )}
          <li className="navbar-user">
            <span>
              <FiUser /> {user?.name} ({user?.role})
            </span>
            <button onClick={handleLogout} className="logout-btn">
              <FiLogOut /> Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
