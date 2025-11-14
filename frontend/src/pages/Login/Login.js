import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/home"); // already logged in
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("isAuthenticated", "true");
    navigate("/home");
  };

  return (
    <div className="login-page">
      {/* ✅ Top-left Back Button */}
      <button className="back-btn" onClick={() => navigate("/")}>
        <FaArrowLeft className="back-icon" /> Back
      </button>

      <div className="login-container">
        <h1 className="login-title">LOGIN</h1>

        <form className="login-form" onSubmit={handleLogin}>
          <label>School Email</label>
          <div className="input-with-icon">
            <FaEnvelope className="input-icon" />
            <input type="email" placeholder="yourname@cit.edu" required />
          </div>

          <label>Password</label>
          <div className="input-with-icon">
            <FaLock className="input-icon" />
            <input type="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" className="sign-in-btn">
            Sign In
          </button>

          <p className="forgot-password">Forgot password?</p>

          <div className="divider">DON'T HAVE ANY ACCOUNT?</div>

          <button
            type="button"
            className="create-account-btn"
            onClick={() => navigate("/signup")}
          >
            Create New Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
