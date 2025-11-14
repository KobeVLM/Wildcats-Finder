import React from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaPhone,  FaArrowLeft } from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    alert("Account created successfully!");
    navigate("/login");
  };

  return (
    <div className="signup-page">
      {/* ✅ Top-left Back Button */}
            <button className="back-btn" onClick={() => navigate("/")}>
              <FaArrowLeft className="back-icon" /> Back
            </button>
      <div className="signup-container">
        <h1 className="signup-title">CREATE ACCOUNT</h1>

        <form className="signup-form" onSubmit={handleSignup}>
          <label>School Email (Username)</label>
          <div className="input-with-icon">
            <FaEnvelope className="input-icon" />
            <input type="email" placeholder="yourname@cit.edu" required />
          </div>

          <label>Password</label>
          <div className="input-with-icon">
            <FaLock className="input-icon" />
            <input type="password" placeholder="Enter your password" required />
          </div>

          <label>First Name</label>
          <div className="input-with-icon">
            <FaUser className="input-icon" />
            <input type="text" placeholder="Enter your first name" required />
          </div>

          <label>Middle Name (Optional)</label>
          <div className="input-with-icon">
            <FaUser className="input-icon" />
            <input type="text" placeholder="Enter your middle name" />
          </div>

          <label>Last Name</label>
          <div className="input-with-icon">
            <FaUser className="input-icon" />
            <input type="text" placeholder="Enter your last name" required />
          </div>

          <label>Contact Number</label>
          <div className="input-with-icon">
            <FaPhone className="input-icon" />
            <input type="text" placeholder="Enter your contact number" required />
          </div>

          <button type="submit" className="sign-up-btn">Sign Up</button>

          <div className="divider">ALREADY HAVE AN ACCOUNT?</div>
          <button
            type="button"
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
