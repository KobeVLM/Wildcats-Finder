import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { FaSignOutAlt, FaEnvelope, FaUserCircle, FaCog, FaClipboardList } from "react-icons/fa";
import "./Profile.css";

function Profile() {
  const { user, setUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("active");
  const [activeReports, setActiveReports] = useState([]);
  const [claimedReports, setClaimedReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's reports
  useEffect(() => {
    const fetchReports = async () => {
      if (!user || !user.userId) return;

      try {
        setLoading(true);
        // Fetch items reported by this user
        const itemsResponse = await fetch(`http://localhost:8080/api/items/user/${user.userId}`);
        const items = await itemsResponse.json();

        // Fetch claims made by this user (items they are trying to claim)
        const claimsResponse = await fetch(`http://localhost:8080/api/claims/user/${user.userId}`);
        const claims = await claimsResponse.json();

        // Active reports are items that are still LOST or FOUND
        const active = items.filter(item => item.status === "LOST" || item.status === "FOUND");
        setActiveReports(active);

        // Claimed reports are claims the user has made (items they're claiming ownership of)
        setClaimedReports(claims);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]); const handleLogout = () => {
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
      <div className="profile-container">
        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="profile-header-left">
            {/* Profile Circle with initials */}
            <div className="profile-circle">
              {getUserInitials()}
            </div>

            {/* User info */}
            <div className="profile-info">
              <h2 className="profile-name">{getFullName()}</h2>
              <div className="profile-email">
                <FaEnvelope /> <span>{getDisplayEmail()}</span>
              </div>
              <div className="role-container">
                <FaUserCircle className="role-icon" />
                <div className="profile-role">{getDisplayRole()}</div>
              </div>
            </div>
          </div>

          {/* Top-right buttons */}
          <div className="profile-header-actions">
            <button className="btn-settings">
              <FaCog />
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-number maroon">{activeReports.length}</div>
            <div className="stat-label">Active Reports</div>
          </div>
          <div className="stat-card">
            <div className="stat-number gold">{claimedReports.length}</div>
            <div className="stat-label">Claimed</div>
          </div>
        </div>
      </div>

      {/* My Reports Section */}
      <div className="reports-container">
        <div className="reports-header">
          <FaClipboardList className="reports-icon" />
          <h3>My Reports</h3>
        </div>

        {/* Tabs */}
        <div className="reports-tabs">
          <button
            className={`tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active
            <span className="tab-badge">{activeReports.length}</span>
          </button>
          <button
            className={`tab ${activeTab === "claimed" ? "active" : ""}`}
            onClick={() => setActiveTab("claimed")}
          >
            Claimed
            <span className="tab-badge">{claimedReports.length}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="reports-content">
          {loading ? (
            <div className="no-reports">Loading...</div>
          ) : activeTab === "active" ? (
            activeReports.length > 0 ? (
              <div className="reports-grid">
                {activeReports.map((item) => (
                  <div key={item.itemId} className="report-card">
                    <img
                      src={item.imageUrl || "https://via.placeholder.com/150"}
                      alt={item.itemTitle}
                      className="report-image"
                    />
                    <div className="report-details">
                      <h4>{item.itemTitle}</h4>
                      <p className="report-desc">{item.itemDesc}</p>
                      <p className="report-location">📍 {item.location}</p>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-reports">No active reports</div>
            )
          ) : claimedReports.length > 0 ? (
            <div className="reports-grid">
              {claimedReports.map((claim) => (
                <div key={claim.claimId} className="report-card">
                  <div className="report-details">
                    <h4>Claim #{claim.claimId}</h4>
                    <p className="report-desc">{claim.verificationAnswer}</p>
                    <p className="report-date">
                      📅 {new Date(claim.claimDate).toLocaleDateString()}
                    </p>
                    <span className={`status-badge ${claim.status.toLowerCase()}`}>
                      {claim.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reports">No claimed reports</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;