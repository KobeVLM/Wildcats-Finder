// C:\Wildcats-Finder\Wildcats-Finder\frontend\src\components\sidebar\Sidebar.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import homeIcon from '../../assets/icons/home.png';
import reportItemIcon from '../../assets/icons/report-item.png';
import searchIcon from '../../assets/icons/search.png';
import profileIcon from '../../assets/icons/profile.png';
import claimIcon from '../../assets/icons/claim.png';
import logo from '../../assets/images/Logo1.png';
import { FaChevronDown, FaChevronRight, FaChevronLeft, FaChevronRight as FaRight } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  const [reportSubmenuOpen, setReportSubmenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleReportSubmenu = () => {
    if (!sidebarCollapsed) {
      setReportSubmenuOpen(!reportSubmenuOpen);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    if (sidebarCollapsed) {
      setReportSubmenuOpen(false);
    }
    
    // Update CSS variable or class on body for main content adjustment
    document.body.classList.toggle('sidebar-collapsed', !sidebarCollapsed);
  };

  return (
    <div className={`sidebar-nav ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Collapse Toggle Button */}
      <button className="sidebar-collapse-btn" onClick={toggleSidebar}>
        {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      {/* Logo at the top */}
      <div className="sidebar-logo">
        <img src={logo} alt="Wildcats Finder Logo" className="sidebar-logo-img" />
        {!sidebarCollapsed && <span className="logo-text"></span>}
      </div>

      {/* Navigation Items */}
      <ul className="sidebar-links">
        <li>
          <NavLink 
            to="/home" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            title="Home"
          >
            <div className="sidebar-link-content">
              <img src={homeIcon} alt="Home Icon" className="sidebar-icon" />
              {!sidebarCollapsed && <span className="sidebar-link-text">Home</span>}
              {sidebarCollapsed && <span className="sidebar-tooltip">Home</span>}
            </div>
          </NavLink>
        </li>

        {/* Report Item with Sub-navigation */}
        <li className="sidebar-item-with-submenu">
          <button 
            onClick={toggleReportSubmenu}
            className="sidebar-link submenu-toggle"
            title="Report Item"
          >
            <div className="sidebar-link-content">
              <img src={reportItemIcon} alt="Report Item Icon" className="sidebar-icon" />
              {!sidebarCollapsed && <span className="sidebar-link-text">Report Item</span>}
              {!sidebarCollapsed && (
                <span className="submenu-arrow">
                  {reportSubmenuOpen ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              )}
              {sidebarCollapsed && <span className="sidebar-tooltip">Report Item</span>}
            </div>
          </button>
          
          {/* Sub-navigation items - Only show when sidebar is expanded */}
          {!sidebarCollapsed && reportSubmenuOpen && (
            <ul className="sidebar-submenu">
              <li>
                <NavLink 
                  to="/report-item" 
                  end
                  className={({ isActive }) => 
                    `sidebar-submenu-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="sidebar-submenu-text">Report Page</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/report-item/list" 
                  className={({ isActive }) => 
                    `sidebar-submenu-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="sidebar-submenu-text">Item List</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/report-item/tips" 
                  className={({ isActive }) => 
                    `sidebar-submenu-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="sidebar-submenu-text">Tips</span>
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li>
          <NavLink 
            to="/search" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            title="Search"
          >
            <div className="sidebar-link-content">
              <img src={searchIcon} alt="Search Icon" className="sidebar-icon" />
              {!sidebarCollapsed && <span className="sidebar-link-text">Search</span>}
              {sidebarCollapsed && <span className="sidebar-tooltip">Search</span>}
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/claim" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            title="Claim"
          >
            <div className="sidebar-link-content">
              <img src={claimIcon} alt="Claim Icon" className="sidebar-icon" />
              {!sidebarCollapsed && <span className="sidebar-link-text">Claim</span>}
              {sidebarCollapsed && <span className="sidebar-tooltip">Claim</span>}
            </div>
          </NavLink>
        </li>
      </ul>

      {/* Separator and Profile/User info - Show differently based on collapsed state */}
      {!sidebarCollapsed ? (
        <>
          <div className="sidebar-separator"></div>

          <div className="profile-link-container">
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `sidebar-link profile-link ${isActive ? 'active' : ''}`
              }
              title="Profile"
            >
              <div className="sidebar-link-content">
                <img src={profileIcon} alt="Profile Icon" className="sidebar-icon" />
                <span className="sidebar-link-text">Profile</span>
              </div>
            </NavLink>
          </div>

          <div className="user-info-section">
            <div className="user-avatar">
              <div className="avatar-placeholder">U</div>
            </div>
            <div className="user-details">
              <span className="user-name">Username</span>
              <span className="user-email">user@example.com</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="sidebar-separator collapsed-separator"></div>
          
          <div className="profile-link-container">
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `sidebar-link profile-link ${isActive ? 'active' : ''}`
              }
              title="Profile"
            >
              <div className="sidebar-link-content">
                <img src={profileIcon} alt="Profile Icon" className="sidebar-icon" />
                <span className="sidebar-tooltip">Profile</span>
              </div>
            </NavLink>
          </div>

          <div className="user-info-section collapsed-user-info" title="User Profile">
            <div className="user-avatar">
              <div className="avatar-placeholder">U</div>
            </div>
            <span className="sidebar-tooltip">Username<br/>user@example.com</span>
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar;