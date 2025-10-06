import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulate login (you can replace this with actual authentication logic)
    localStorage.setItem("isAuthenticated", "true");
    navigate("/"); // Redirect to homepage after login
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <button onClick={handleLogin} className="btn">Login</button>
    </div>
  );
}

export default Login;