import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🛡️ Admin Panel</h2>
      </div>
      
      <ul className="sidebar-menu">
        <li>
          <Link to="/admin">
            <span>📊 Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/home">
            <span>🏠 User Home</span>
          </Link>
        </li>
        <li>
          <Link to="/report-item">
            <span>📝 Report Item</span>
          </Link>
        </li>
        <li>
          <Link to="/search">
            <span>🔍 Search</span>
          </Link>
        </li>
        <li>
          <Link to="/claim">
            <span>✋ Claim Item</span>
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <span>👤 Profile</span>
          </Link>
        </li>
        
        <li>
          <button onClick={handleLogout} className="logout-btn">
            <span>🚪 Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default AdminSidebar;