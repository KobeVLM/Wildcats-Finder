import React, { useState, useContext, useEffect } from "react";
import { FaEnvelope, FaLock, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import Message from "../../components/message/message"; // optional
import { UserContext } from "../../context/UserContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // ✅ get setUser from context
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/home");
    }
  }, [navigate]);

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrorMessage("");

  console.log("Sending login:", formData);

  try {
    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const text = await response.text();
    console.log("Response status:", response.status);
    console.log("Raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
      console.log("Parsed response data:", data);
      console.log("User role from backend:", data.role);
    } catch {
      setErrorMessage(text || "Invalid server response");
      return;
    }

    if (!response.ok) {
      setErrorMessage(data.error || "Something went wrong");
      return;
    }

    // Strip out nested 'user' from reportedItems to prevent recursion
    const cleanedData = {
      ...data,
      reportedItems: data.reportedItems?.map(item => {
        const { user, ...rest } = item; // remove nested user
        return rest;
      }) || []
    };
    
    // Save cleaned data
    setUser(cleanedData);
    localStorage.setItem("user", JSON.stringify(cleanedData));
    localStorage.setItem("isAuthenticated", "true");

    // CHECK USER ROLE FOR REDIRECTION
    console.log("Checking role for redirection:");
    console.log("Role:", cleanedData.role);
    console.log("Email:", cleanedData.email);
    console.log("Username:", cleanedData.username);
    
    const isAdmin = 
      cleanedData.role?.toUpperCase() === 'ADMIN' || 
      cleanedData.email?.includes('@wildcatsf.com') || 
      cleanedData.username?.includes('@wildcatsf.com');
    
    console.log("Is admin?", isAdmin);
    
    if (isAdmin) {
      console.log("Redirecting to admin dashboard");
      navigate("/admin");
    } else {
      console.log("Redirecting to home");
      navigate("/home");
    }

  } catch (error) {
    console.error("Login error caught:", error);
    setErrorMessage("Wrong credentials. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-page">
      <button className="back-btn" onClick={() => navigate("/")}>
        <FaArrowLeft className="back-icon" /> Back
      </button>

      <Message
          text={errorMessage}
          type="error"
          duration={5000}
          onClose={() => setErrorMessage("")}
        />

      <div className="login-container">
        <h1 className="login-title">LOGIN</h1>

        <form className="login-form" onSubmit={handleLogin}>
          <label>Username</label>
          <div className="input-with-icon">
            <FaEnvelope className="input-icon" />
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <label>Password</label>
          <div className="input-with-icon password-input-container">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <button type="submit" className="sign-in-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
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

          <p className="admin-signup-link" style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9em', color: '#666' }}>
            Administrator? <Link to="/admin/signup" style={{ color: '#b91c1c', fontWeight: '600', textDecoration: 'none' }}>Create Admin Account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;