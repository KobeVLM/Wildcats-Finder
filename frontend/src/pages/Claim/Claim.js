import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "../../context/UserContext";
import "./Claim.css";

function Claim() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("myItems");
  const [claimsOnMyItems, setClaimsOnMyItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // Wrap fetchClaimsData in useCallback to prevent infinite re-renders
  const fetchClaimsData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch user's reported items to get claims on them
      const itemsResponse = await fetch(`http://localhost:8080/api/items/user/${user.userId}`);
      const userItems = await itemsResponse.json();
      console.log("User's items:", userItems);

      // For each item, fetch the claims
      const claimsPromises = userItems.map(item =>
        fetch(`http://localhost:8080/api/claims/item/${item.itemId}`)
          .then(res => res.json())
          .catch(err => {
            console.error(`Error fetching claims for item ${item.itemId}:`, err);
            return [];
          })
      );
      
      const claimsArrays = await Promise.all(claimsPromises);
      console.log("Claims arrays:", claimsArrays);

      // Flatten and combine with item data
      const claimsWithItems = [];
      claimsArrays.forEach((claims, itemIndex) => {
        if (claims && claims.length > 0) {
          claims.forEach(claim => {
            claimsWithItems.push({
              ...claim,
              itemDetails: userItems[itemIndex]
            });
          });
        }
      });

      console.log("Claims on my items:", claimsWithItems);
      setClaimsOnMyItems(claimsWithItems);

      // Fetch user's own claims
      const myClaimsResponse = await fetch(`http://localhost:8080/api/claims/user/${user.userId}`);
      const myClaimsData = await myClaimsResponse.json();
      console.log("My claims:", myClaimsData);
      setMyClaims(myClaimsData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching claims:", error);
      setLoading(false);
    }
  }, [user]); // Add user as dependency

  useEffect(() => {
    if (user && user.userId) {
      fetchClaimsData();
    }
  }, [user, fetchClaimsData]);

  const handleApprove = async (claimId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/claims/${claimId}/approve`, {
        method: "PUT",
      });

      if (response.ok) {
        alert("Claim approved successfully!");
        fetchClaimsData(); // Refresh the data
      } else {
        alert("Failed to approve claim");
      }
    } catch (error) {
      console.error("Error approving claim:", error);
      alert("Error approving claim");
    }
  };

  const handleReject = async (claimId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/claims/${claimId}/reject`, {
        method: "PUT",
      });

      if (response.ok) {
        alert("Claim rejected successfully!");
        fetchClaimsData(); // Refresh the data
      } else {
        alert("Failed to reject claim");
      }
    } catch (error) {
      console.error("Error rejecting claim:", error);
      alert("Error rejecting claim");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="claim-page">
      <div className="claim-header">
        <h1>Claim Management</h1>
      </div>

      <div className="claim-tabs">
        <button
          className={`claim-tab ${activeTab === "myItems" ? "active" : ""}`}
          onClick={() => setActiveTab("myItems")}
        >
          Claims on My Items
        </button>
        <button
          className={`claim-tab ${activeTab === "myClaims" ? "active" : ""}`}
          onClick={() => setActiveTab("myClaims")}
        >
          My Claims
        </button>
      </div>

      <div className="claim-content">
        {loading ? (
          <div className="loading">Loading claims...</div>
        ) : activeTab === "myItems" ? (
          claimsOnMyItems.length === 0 ? (
            <div className="empty-state">
              <p>No claims received yet</p>
            </div>
          ) : (
            <div className="claims-list">
              {claimsOnMyItems.map((claim) => (
                <div key={claim.claimId} className="claim-card">
                  <div className="claim-card-header">
                    <h3>{claim.itemDetails?.itemTitle || "Unknown Item"}</h3>
                    <span className={`status-badge ${claim.status.toLowerCase()}`}>
                      {claim.status}
                    </span>
                  </div>
                  <div className="claim-card-body">
                    <div className="claim-info">
                      <p><strong>Claimant:</strong> {claim.user?.firstName} {claim.user?.lastName}</p>
                      <p><strong>Email:</strong> {claim.user?.email}</p>
                      <p><strong>Claim Date:</strong> {formatDate(claim.claimDate)}</p>
                      {claim.verificationAnswer && (
                        <p><strong>Verification Answer:</strong> {claim.verificationAnswer}</p>
                      )}
                    </div>
                    <div className="item-details">
                      <p><strong>Item Description:</strong> {claim.itemDetails?.itemDesc}</p>
                      <p><strong>Location Found:</strong> {claim.itemDetails?.location}</p>
                      <p><strong>Date Found:</strong> {formatDate(claim.itemDetails?.dateReport)}</p>
                    </div>
                  </div>
                  {claim.status === "PENDING" && (
                    <div className="claim-card-actions">
                      <button
                        className="btn-approve"
                        onClick={() => handleApprove(claim.claimId)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleReject(claim.claimId)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          myClaims.length === 0 ? (
            <div className="empty-state">
              <p>No claims received yet</p>
            </div>
          ) : (
            <div className="claims-list">
              {myClaims.map((claim) => (
                <div key={claim.claimId} className="claim-card">
                  <div className="claim-card-header">
                    <h3>{claim.item?.itemTitle || "Unknown Item"}</h3>
                    <span className={`status-badge ${claim.status.toLowerCase()}`}>
                      {claim.status}
                    </span>
                  </div>
                  <div className="claim-card-body">
                    <div className="claim-info">
                      <p><strong>Claim Date:</strong> {formatDate(claim.claimDate)}</p>
                      {claim.verificationAnswer && (
                        <p><strong>Your Verification Answer:</strong> {claim.verificationAnswer}</p>
                      )}
                    </div>
                    <div className="item-details">
                      <p><strong>Item Description:</strong> {claim.item?.itemDesc}</p>
                      <p><strong>Location Found:</strong> {claim.item?.location}</p>
                      <p><strong>Date Found:</strong> {formatDate(claim.item?.dateReport)}</p>
                      <p><strong>Reported By:</strong> {claim.item?.user?.firstName} {claim.item?.user?.lastName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Claim;