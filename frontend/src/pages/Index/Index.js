import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar"; // Adjust path as needed
import "./Index.css";

function Index() {
  useEffect(() => {
    localStorage.removeItem("isAuthenticated");
  }, []);

  return (
    <div className="index-page">
      {/* Use the Navbar component */}
      <Navbar />

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