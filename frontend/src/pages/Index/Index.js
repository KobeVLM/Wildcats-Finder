import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Index.css";
import logo from "../../assets/images/Logo1.png";

function Index() {
  useEffect(() => {
    localStorage.removeItem("isAuthenticated");
  }, []);

  return (
    <div className="index-page">
      {/* Landing Navbar */}
      <nav className="landing-navbar">
        <div className="landing-navbar-logo">
          <img src={logo} alt="Wildcats Finder Logo" className="landing-logo" />
        </div>
        <ul className="landing-navbar-links">
          <li>
            <Link to="/about" className="landing-link">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="landing-link">
              Contact
            </Link>
          </li>
          <li>|</li>
          <li>
            <Link to="/login" className="landing-link">
              Login
            </Link>
          </li>
          <li>
            <Link to="/signup" className="landing-link join-us">
              Join Us
            </Link>
          </li>
        </ul>
      </nav>

      {/* Content */}
      <div className="overlay"></div>

      <div className="content">
        <div className="upper-section">
          <h1 className="title">Find What Matters Most</h1>
          <p className="subtitle">
            Discovering your lost belongings in faster and easier than ever
          </p>
        </div>

        <div className="lower-section">
          <Link to="/login" className="btn-get-started">
            Get Started
          </Link>
        </div>
      </div>

      <div className="rectangle-section">
        <div className="rectangle-text">
          <h2 className="rectangle-title">Student Friend Web-System</h2>
          <p className="rectangle-subtitle">
            A modern lost & found system built to make every recovery
            effortless.
          </p>
          <p className="rectangle-subtitle">
            Because finding lost items should be as quick as sending a message.
          </p>
        </div>
      </div>

      <div className="square-section"></div>

      <footer className="footer">
        © 2025 Wildcats Finder. All rights reserved.
      </footer>
    </div>
  );
}

export default Index;
