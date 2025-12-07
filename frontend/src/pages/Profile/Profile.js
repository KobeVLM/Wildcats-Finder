import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { FaSignOutAlt, FaEnvelope, FaUserCircle, FaCog } from "react-icons/fa";
import "./Profile.css";

function Profile() {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    const confirmLogout = window.confirm("End session?");
    if (!confirmLogout) return;

    // Clear context & localStorage
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Optional: redirect to login
    window.location.href = "/login";
  };

  if (!user) {
    return <div className="profile-loading">Loading user profile...</div>;
  }

  // Use lowercase property names (fname, mname, lname)
  const getFullName = () => {
    const firstName = user.fname || "";
    const middleName = user.mname || "";
    const lastName = user.lname || "";
    
    let fullName = firstName;
    
    if (middleName && middleName.trim() !== "") {
      fullName += ` ${middleName.charAt(0)}.`;
    }
    
    if (lastName) {
      fullName += ` ${lastName}`;
    }
    
    return fullName.trim() || user.username || "User";
  };

  // Get user initials for the circle
  const getUserInitials = () => {
    let initials = "";
    
    // Use lowercase property names
    if (user.fname) initials += user.fname.charAt(0).toUpperCase();
    if (user.lname) initials += user.lname.charAt(0).toUpperCase();
    
    // Fallback to username initials
    if (!initials && user.username) {
      const emailPart = user.username.split('@')[0];
      if (emailPart.includes('.')) {
        const parts = emailPart.split('.');
        initials = (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
      } else {
        initials = emailPart.charAt(0).toUpperCase();
      }
    }
    
    return initials || "U";
  };

  // Get email/username for display
  const getDisplayEmail = () => {
    return user.email || user.username || "No email";
  };

  // Get user role (capitalize first letter)
  const getDisplayRole = () => {
    if (!user.role) return "User";
    return user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Profile Circle on left with initials */}
        <div className="profile-circle">
          {getUserInitials()}
        </div>

        {/* Left-side info container */}
        <div className="profile-info-left">
          <h2 className="profile-name">
            {getFullName()}
          </h2>
          <div className="profile-email">
            <FaEnvelope /> <span>{getDisplayEmail()}</span>
          </div>
          <div className="role-container">
            <FaUserCircle className="role-icon" />
            <div className="profile-role">{getDisplayRole()}</div>
          </div>
        </div>

        {/* Top-right buttons */}
        <div className="card-top-buttons">
          <button className="btn settings">
            <FaCog /> Settings
          </button>
          <button className="btn logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

    </div>
  );
}

export default Profile;