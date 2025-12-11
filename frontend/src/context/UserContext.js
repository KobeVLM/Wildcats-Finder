// UserContext.js
import React, { createContext, useState, useEffect } from "react";

// ✅ Only declare UserContext once at the top level
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user from backend and sync with localStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // First check localStorage for cached user
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        if (storedUser) {
          // Set cached user immediately for faster UI
          setUser(JSON.parse(storedUser));
        }
        
        // Then fetch fresh data from backend if we have a token
        if (token) {
          const response = await fetch("http://localhost:8080/api/users/current", {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            // If token is invalid, clear everything
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        // On error, keep cached user if exists
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Sync user changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Login function
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Update user function
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      login, 
      logout, 
      updateUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};
