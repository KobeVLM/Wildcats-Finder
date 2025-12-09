// C:\Wildcats-Finder\Wildcats-Finder\frontend\src\App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/sidebar/Sidebar";

// Pages
import Index from "./pages/Index/Index";
import Home from "./pages/Home/Home";
import ReportItem from "./pages/ReportItem/ReportItem";
import Search from "./pages/Search/Search";
import Claim from "./pages/Claim/Claim";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Contact from "./pages/Contact/Contact";
import About from "./pages/About/About";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  // Listen for authentication changes
  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
    };

    // Check auth status initially
    handleAuthChange();

    // Check periodically
    const interval = setInterval(handleAuthChange, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Show Sidebar only when logged in */}
        {isAuthenticated && <Sidebar />}

        <div className={`main-content ${isAuthenticated ? 'with-sidebar' : ''}`}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/report-item/*"
              element={
                <ProtectedRoute>
                  <ReportItem />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              }
            />
            <Route
              path="/claim"
              element={
                <ProtectedRoute>
                  <Claim />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;