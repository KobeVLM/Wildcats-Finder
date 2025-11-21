import React from "react";
import { FaEnvelope, FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import "./Profile.css";

function Profile({ user }) {
  const profileUser = user || {
    name: "Guest User",
    email: "lastname.firstname@cit.edu",
    role: "Student",
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Profile Circle on left */}
        <div className="profile-circle">{getInitials(profileUser.name)}</div>

        {/* Left-side info container */}
        <div className="profile-info-left">
          <h2 className="profile-name">{profileUser.name}</h2>
          <div className="profile-email">
            <FaEnvelope /> <span>{profileUser.email}</span>
          </div><FaUserCircle />
          <div className="profile-role">
           <span>{profileUser.role}</span>
          </div>
        </div>

        {/* Top-right buttons */}
        <div className="card-top-buttons">
          <button className="btn settings">
            <FaCog /> Settings
          </button>
          <button className="btn logout">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
