import React, { useState } from "react";
import "./Signup.css";
import { useNavigate, Link } from "react-router-dom";
import Message from "../../components/message/message"; 
import { FaEnvelope, FaLock, FaUser, FaPhone, FaArrowLeft } from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fName: "",
    mName: "",
    lName: "",
    email: "",
    contactNo: "",
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");   // message text
  const [msgType, setMsgType] = useState("info"); // success | error | info

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSignup = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Determine role based on email domain
    const isAdmin = formData.username.includes('@wildcatsf.com') || 
                   formData.email.includes('@wildcatsf.com');
    const userRole = isAdmin ? 'ADMIN' : 'USER';
    
    console.log("Signing up with role:", userRole);

    const userData = {
      ...formData,
      role: userRole // Send role to backend
    };

    const response = await fetch("http://localhost:8080/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const responseText = await response.text();
    console.log("Signup response:", responseText);

    if (response.ok) {
      setMsgType("success");
      setMessage(
        isAdmin 
          ? "Admin account created successfully!" 
          : "Account created successfully!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setMsgType("error");
      setMessage(responseText || "Signup failed.");
    }
  } catch (error) {
    console.error("Signup fetch error:", error);
    setMsgType("error");
    setMessage("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="signup-page">
      {/* Floating message component */}
      <Message
        text={message}
        type={msgType}
        duration={5000}
        onClose={() => setMessage("")}
      />

      <button className="back-btn" onClick={() => navigate("/")}>
        <FaArrowLeft className="back-icon" /> Back
      </button>

      <div className="signup-container">
        <h1 className="signup-title">CREATE ACCOUNT</h1>

        <form className="signup-form" onSubmit={handleSignup}>
          <label>School Email (Username)</label>
          <div className="input-with-icon">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="username"
              placeholder="yourname@cit.edu"
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

          <label>First Name</label>
          <div className="input-with-icon">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="fName"
              placeholder="Enter your first name"
              value={formData.fName}
              onChange={handleChange}
              required
            />
          </div>

          <label>Middle Name (Optional)</label>
          <div className="input-with-icon">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="mName"
              placeholder="Enter your middle name"
              value={formData.mName}
              onChange={handleChange}
            />
          </div>

          <label>Last Name</label>
          <div className="input-with-icon">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="lName"
              placeholder="Enter your last name"
              value={formData.lName}
              onChange={handleChange}
              required
            />
          </div>

          <label>Email</label>
          <div className="input-with-icon">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <label>Contact Number</label>
          <div className="input-with-icon">
            <FaPhone className="input-icon" />
            <input
              type="text"
              name="contactNo"
              placeholder="Enter your contact number"
              value={formData.contactNo}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="sign-up-btn" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <div className="divider">ALREADY HAVE AN ACCOUNT?</div>
          <button
            type="button"
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>

          <p className="admin-signup-link" style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9em', color: '#666' }}>
            Administrator? <Link to="/admin/signup" style={{ color: '#b91c1c', fontWeight: '600', textDecoration: 'none' }}>Create Admin Account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
