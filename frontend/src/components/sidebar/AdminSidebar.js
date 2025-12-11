// AdminSidebar.js
import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import homeIcon from '../../assets/icons/home.png';
import reportItemIcon from '../../assets/icons/report-item.png';
import searchIcon from '../../assets/icons/search.png';
import profileIcon from '../../assets/icons/profile.png';
import claimIcon from '../../assets/icons/claim.png';
import logo from '../../assets/images/Logo1.png';
import { FaChevronRight, FaChevronLeft, FaTachometerAlt, FaChartBar } from 'react-icons/fa';
import './AdminSidebar.css';

function AdminSidebar() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useContext(UserContext);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    document.body.classList.toggle('sidebar-collapsed', !sidebarCollapsed);
  };

  // Function to get user's full name
  const getFullName = () => {
    if (!user) return "Admin";
    
    const firstName = user.fname || "";
    const middleName = user.mname || "";
    const lastName = user.lname || "";
    
    let fullName = firstName;
    
    if (middleName && middleName.trim() !== "") {
      fullName += ` ${middleName.charAt(0)}.`;
    }
    
    if (lastName) {
      fullName += ` ${lastName}`;
    }
    
    return fullName.trim() || user.username || "Admin User";
  };

  // Function to get user's initials for avatar
  const getUserInitials = () => {
    if (!user) return "A";
    
    let initials = "";
    if (user.fname) initials += user.fname.charAt(0).toUpperCase();
    if (user.lname) initials += user.lname.charAt(0).toUpperCase();
    
    return initials || user.username?.charAt(0).toUpperCase() || "A";
  };

  // Function to get display username (email)
  const getDisplayUsername = () => {
    if (!user) return "admin@example.com";
    return user.username || user.email || "admin@example.com";
  };

  return (
    <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Collapse Toggle Button */}
      <button className="sidebar-collapse-btn" onClick={toggleSidebar}>
        {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      {/* Logo at the top */}
      <div className="admin-logo">
        <img src={logo} alt="Wildcats Finder Admin Logo" className="admin-logo-img" />
        {!sidebarCollapsed && <span className="admin-logo-text">ADMIN</span>}
      </div>

      {/* Navigation Items */}
      <ul className="admin-sidebar-links">
        {/* Dashboard */}
        <li>
          <NavLink 
            to="/admin" 
            className={({ isActive }) => 
              `admin-sidebar-link ${isActive ? 'active' : ''}`
            }
            title="Dashboard"
          >
            <div className="admin-sidebar-link-content">
              <FaTachometerAlt className="admin-sidebar-icon" />
              {!sidebarCollapsed && <span className="admin-sidebar-link-text">Dashboard</span>}
              {sidebarCollapsed && <span className="sidebar-tooltip">Dashboard</span>}
            </div>
          </NavLink>
        </li>

        {/* Home */}
        <li>
          <NavLink 
            to="/home" 
            className={({ isActive }) => 
              `admin-sidebar-link ${isActive ? 'active' : ''}`
            }
            title="Home"
          >
            <div className="admin-sidebar-link-content">
              <img src={homeIcon} alt="Home Icon" className="admin-sidebar-icon" />
              {!sidebarCollapsed && <span className="admin-sidebar-link-text">Home</span>}
              {sidebarCollapsed && <span className="sidebar-tooltip">Home</span>}
            </div>
          </NavLink>
        </li>

        {/* Report Item */}
        <li>
          <NavLink 
            to="/report-item" 
            className={({ isActive }) => 
              `admin-sidebar-link ${isActive ? 'active' : ''}`
            }
            title="Report Page"
          >
            <div className="admin-sidebar-link-content">
              <img src={reportItemIcon} alt="Report Item Icon" className="admin-sidebar-icon" />
              {!sidebarCollapsed && <span className="admin-sidebar-link-text">Report Page</span>}
              {sidebarCollapsed && <span className="sidebar-tooltip">Report Page</span>}
            </div>
          </NavLink>
        </li>

        {/* Search */}
        <li>
          <NavLink 
            to="/search" 
            className={({ isActive }) => 
              `admin-sidebar-link ${isActive ? 'active' : ''}`
            }
            title="Search"
          >
            <div className="admin-sidebar-link-content">
              <img src={searchIcon} alt="Search Icon" className="admin-sidebar-icon" />
              {!sidebarCollapsed && <span className="admin-sidebar-link-text">Search</span>}
              {sidebarCollapsed && <span className="sidebar-tooltip">Search</span>}
            </div>
          </NavLink>
        </li>

        {/* Claims */}
        <li>
          <NavLink
            to="/claim" 
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? 'active' : ''}`
            }
            title="Claim"
          >
            <div className="admin-sidebar-link-content">
              <img src={claimIcon} alt="Claim Icon" className="admin-sidebar-icon" />
              {!sidebarCollapsed && <span className="admin-sidebar-link-text">Claims</span>}
              {sidebarCollapsed && <span className="sidebar-tooltip">Claims</span>}
            </div>
          </NavLink>
        </li>

        {/* Analytics */}
        <li>
          <NavLink
            to="/admin/analytics" 
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? 'active' : ''}`
            }
            title="Analytics"
          >
            <div className="admin-sidebar-link-content">
              <FaChartBar className="admin-sidebar-icon" />
              {!sidebarCollapsed && <span className="admin-sidebar-link-text">Analytics</span>}
              {sidebarCollapsed && <span className="sidebar-tooltip">Analytics</span>}
            </div>
          </NavLink>
        </li>

        {/* Profile */}
        <li>
          <NavLink
            to="/profile" 
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? 'active' : ''}`
            }
            title="Profile"
          >
            <div className="admin-sidebar-link-content">
              <img src={profileIcon} alt="Profile Icon" className="admin-sidebar-icon" />
              {!sidebarCollapsed && <span className="admin-sidebar-link-text">Profile</span>}
              {sidebarCollapsed && <span className="sidebar-tooltip">Profile</span>}
            </div>
          </NavLink>
        </li>
      </ul>

      {/* User Info */}
      <div className="admin-user-info">
        {!sidebarCollapsed ? (
          <>
            <div className="admin-user-avatar">
              <div className="admin-avatar-placeholder">{getUserInitials()}</div>
            </div>
            <div className="admin-user-details">
              <span className="admin-user-name">{getFullName()}</span>
              <span className="admin-user-email">{getDisplayUsername()}</span>
              <span className="admin-user-role">Administrator</span>
            </div>
          </>
        ) : (
          <div 
            className="admin-user-avatar collapsed-avatar" 
            title={`${getFullName()}\n${getDisplayUsername()}\nAdministrator`}
          >
            <div className="admin-avatar-placeholder">{getUserInitials()}</div>
            <span className="sidebar-tooltip">
              {getFullName()}<br/>{getDisplayUsername()}<br/>Administrator
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSidebar;