import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./ItemDetail.css";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/items/${id}`);
        
        if (!response.ok) {
          throw new Error("Item not found");
        }
        
        const data = await response.json();
        setItem(data);
      } catch (err) {
        console.error("Error fetching item:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const handleClaimItem = async () => {
    if (!user) {
      alert("Please log in to claim an item.");
      navigate("/login");
      return;
    }

    if (item.userId === user.userId) {
      alert("You cannot claim your own item.");
      return;
    }

    const verificationAnswer = prompt(
      `To claim "${item.itemTitle}", please provide details to verify ownership:\n` +
      `Where did you lose it? Any identifying marks?`
    );

    if (!verificationAnswer || verificationAnswer.trim() === "") {
      alert("Verification details are required to claim an item");
      return;
    }

    try {
      setClaiming(true);
      const claimData = {
        itemId: item.itemId,
        userId: user.userId,
        verificationAnswer: verificationAnswer.trim(),
        status: "PENDING",
        verified: false
      };

      const response = await fetch("http://localhost:8080/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(claimData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ Claim submitted successfully!\n\nClaim ID: ${result.claimId}\nStatus: ${result.status}\n\nThe item finder will review your claim.`);
      } else {
        const errorText = await response.text();
        alert(`❌ Error: ${errorText}`);
      }
    } catch (error) {
      console.error("Error claiming item:", error);
      alert("Network error. Please try again.");
    } finally {
      setClaiming(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="item-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="item-detail-page">
        <div className="error-container">
          <h2>❌ {error || "Item not found"}</h2>
          <button onClick={() => navigate(-1)} className="back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && item.userId === user.userId;
  const canClaim = item.status === "FOUND" && !isOwner;

  return (
    <div className="item-detail-page">
      <div className="item-detail-container">
        {/* Header */}
        <div className="detail-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
          <span className={`status-badge status-${item.status?.toLowerCase()}`}>
            {item.status}
          </span>
        </div>

        {/* Main Content */}
        <div className="detail-content">
          {/* Image Section */}
          <div className="detail-image-section">
            {item.imageUrl ? (
              <img
                src={`http://localhost:8080${item.imageUrl}`}
                alt={item.itemTitle}
                className="detail-image"
              />
            ) : (
              <div className="detail-image-placeholder">
                <span>📷</span>
                <p>No image available</p>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="detail-info-section">
            <h1 className="detail-title">{item.itemTitle}</h1>
            
            <div className="detail-meta">
              <div className="meta-row">
                <span className="meta-icon">📍</span>
                <span className="meta-label">Location:</span>
                <span className="meta-value">{item.location || "Not specified"}</span>
              </div>
              <div className="meta-row">
                <span className="meta-icon">📅</span>
                <span className="meta-label">Date Reported:</span>
                <span className="meta-value">{formatDate(item.dateReport)}</span>
              </div>
              {item.categoryName && (
                <div className="meta-row">
                  <span className="meta-icon">🏷️</span>
                  <span className="meta-label">Category:</span>
                  <span className="meta-value">{item.categoryName}</span>
                </div>
              )}
              {item.departmentName && (
                <div className="meta-row">
                  <span className="meta-icon">🏢</span>
                  <span className="meta-label">Department:</span>
                  <span className="meta-value">{item.departmentName}</span>
                </div>
              )}
              <div className="meta-row">
                <span className="meta-icon">👤</span>
                <span className="meta-label">Reported by:</span>
                <span className="meta-value">
                  {isOwner ? "You" : `User #${item.userId}`}
                </span>
              </div>
            </div>

            <div className="detail-description">
              <h3>Description</h3>
              <p>{item.itemDesc || "No description provided."}</p>
            </div>

            {/* Action Buttons */}
            <div className="detail-actions">
              {canClaim && (
                <button
                  className="claim-btn"
                  onClick={handleClaimItem}
                  disabled={claiming}
                >
                  {claiming ? "Submitting..." : "🙋 This is Mine!"}
                </button>
              )}
              {isOwner && (
                <div className="owner-badge">
                  <span>👑</span> You reported this item
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
