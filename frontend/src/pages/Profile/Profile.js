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
    localStorage.removeItem("isAuthenticated");

    // Optional: redirect to login
    window.location.href = "/login";
  };

  if (!user) {
    return <div>Loading...</div>; // or redirect to login
  }

  // Build full name from database fields
  const fullName = [user.fName, user.mName, user.lName]
    .filter(Boolean) // removes undefined/null
    .join(" ");

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
 
    <div className="profile-page">
  <div className="profile-card">
    {/* Profile Circle on left */}
    <div className="profile-circle">
      {getInitials(
        [user.fName, user.mName, user.lName].filter(Boolean).join(" ") || user.username
      )}
    </div>

    {/* Left-side info container */}
    <div className="profile-info-left">
      <h2 className="profile-name">
        {[user.fName, user.mName, user.lName].filter(Boolean).join(" ") || user.username}
      </h2>
      <div className="profile-email">
        <FaEnvelope /> <span>{user.email}</span>
      </div>
      <div className="role-container">
        <FaUserCircle className="role-icon" />
        <div className="profile-role">{user.role}</div>
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
