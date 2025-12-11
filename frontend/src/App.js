import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/sidebar/Sidebar";
import AdminSidebar from "./components/sidebar/AdminSidebar";

// Context
import { UserContext } from "./context/UserContext";

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
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

// Create a wrapper component to access location
function AppContent() {
  const { user, loading } = useContext(UserContext);
  const location = useLocation();
  
  const isAuthenticated = !!user;
  
  // Case-insensitive check for admin
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  // Pages where sidebar should NOT appear (public pages)
  const noSidebarPaths = ['/', '/about', '/contact', '/login', '/signup'];
  const currentPath = location.pathname;
  
  // Only show sidebar if user is authenticated AND not on a public page
  const showSidebar = isAuthenticated && !noSidebarPaths.includes(currentPath);
  
  // Debug log
  console.log("Current path:", currentPath);
  console.log("Is authenticated:", isAuthenticated);
  console.log("Show sidebar:", showSidebar);
  console.log("User role:", user?.role);

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <div className="App">
      {/* Conditionally render sidebar */}
      {showSidebar && (
        isAdmin ? <AdminSidebar /> : <Sidebar />
      )}
      
      <div className={`main-content ${showSidebar ? 'with-sidebar' : ''}`}>
        <Routes>
          {/* Public routes - no sidebar */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes - with sidebar when authenticated */}
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

          {/* Admin route - only accessible by admins */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </div>
  );
}

// Main App component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;