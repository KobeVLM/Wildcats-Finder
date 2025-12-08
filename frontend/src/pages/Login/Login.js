import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import Message from "../../components/message/message"; // optional
import { UserContext } from "../../context/UserContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // ✅ get setUser from context
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
    console.log("Response text:", text);

    let data;
    try {
      data = JSON.parse(text); // parse JSON safely
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
    navigate("/home");

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

      <div className="login-container">
        <h1 className="login-title">LOGIN</h1>

        <Message
          text={errorMessage}
          type="error"
          duration={5000}
          onClose={() => setErrorMessage("")}
        />

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
          <div className="input-with-icon">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
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
