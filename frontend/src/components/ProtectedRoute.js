// ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useContext(UserContext);
  
  console.log("🔐 ProtectedRoute - Component:", children.type?.name || "Component");
  console.log("🔐 ProtectedRoute - User:", user);
  console.log("🔐 ProtectedRoute - User role:", user?.role);
  console.log("🔐 ProtectedRoute - Require admin:", requireAdmin);
  
  if (!user) {
    console.log("❌ No user, redirecting to /login");
    return <Navigate to="/login" />;
  }
  
  // Case-insensitive admin check
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  console.log("🔐 ProtectedRoute - Is admin (case-insensitive):", isAdmin);
  
  if (requireAdmin && !isAdmin) {
    console.log("❌ Admin required but user is not admin, redirecting to /home");
    console.log("❌ User role is:", `'${user?.role}'`);
    return <Navigate to="/home" />;
  }
  
  console.log("✅ Access granted!");
  return children;
};

export default ProtectedRoute;