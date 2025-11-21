import React from 'react';
import { Link } from 'react-router-dom';

import homeIcon from '../assets/icons/home.png';
import reportItemIcon from '../assets/icons/report-item.png';
import searchIcon from '../assets/icons/search.png';
import profileIcon from '../assets/icons/profile.png';
import logo from '../assets/images/Logo1.png';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Wildcats Finder Logo" className="logo" />
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/home"><img src={homeIcon} alt="Home Icon" className="icon" /> Home</Link>
        </li>
        <li>
          <Link to="/report-item"><img src={reportItemIcon} alt="Report Item Icon" className="icon" /> Report Item</Link>
        </li>
        <li>
          <Link to="/search"><img src={searchIcon} alt="Search Icon" className="icon" /> Search</Link>
        </li>
        <li>
          <Link to="/profile"><img src={profileIcon} alt="Profile Icon" className="icon" /> Profile</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;