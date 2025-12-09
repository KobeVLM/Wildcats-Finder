import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/Logo1.png"; // Adjust path if needed
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  
  // Function to check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navbar links configuration
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const authLinks = [
    { path: "/login", label: "Login" },
    { path: "/signup", label: "Join Us", className: "join-us" },
  ];

  return (
    <nav className="landing-navbar">
      <div className="landing-navbar-logo">
        <img src={logo} alt="Wildcats Finder Logo" className="landing-logo" />
      </div>
      
      <ul className="landing-navbar-links">
        {/* Main navigation links */}
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link 
              to={link.path} 
              className={`landing-link ${isActive(link.path) ? "active" : ""}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
        
        {/* Separator */}
        <li className="separator">|</li>
        
        {/* Authentication links */}
        {authLinks.map((link) => (
          <li key={link.path}>
            <Link 
              to={link.path} 
              className={`landing-link ${isActive(link.path) ? "active" : ""} ${link.className || ""}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;