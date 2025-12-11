import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../context/UserContext';
import UserManagementTab from '../../components/UserManagementTab';
import itemService from '../../services/itemService';
import './AdminDashboard.css';

import { 
  FaCheckCircle,
  FaCheck,
  FaClock,
  FaEye,
  FaTimes,
  FaUsers,
  FaBox,
  FaClipboardCheck,
  FaExclamationTriangle
} from "react-icons/fa";

function AdminDashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({ total: 0, pending: 0, lost: 0, found: 0, claimed: 0 });
  const [actionLoading, setActionLoading] = useState(null);

  // Check if user is logged in and has admin role
  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== 'admin') {
      navigate("/home");
    }
  }, [user, navigate]);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [itemsData, pendingData, statsData] = await Promise.all([
        itemService.getAllItems(),
        itemService.getPendingItems().catch(() => []),
        itemService.getStats().catch(() => ({}))
      ]);
      setItems(itemsData);
      setPendingItems(pendingData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/claims');
      const data = await response.json();
      setClaims(data);
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  // Approve pending item
  const approveItem = async (itemId, targetStatus) => {
    try {
      setActionLoading(itemId);
      await itemService.approveItem(itemId, targetStatus);
      fetchAllData();
    } catch (error) {
      console.error('Error approving item:', error);
      alert('Error approving item');
    } finally {
      setActionLoading(null);
    }
  };

  // Reject pending item
  const rejectItem = async (itemId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      setActionLoading(itemId);
      await itemService.rejectItem(itemId, reason);
      fetchAllData();
    } catch (error) {
      console.error('Error rejecting item:', error);
      alert('Error rejecting item');
    } finally {
      setActionLoading(null);
    }
  };

  // Update item status
  const updateItemStatus = async (itemId, newStatus) => {
    try {
      setActionLoading(itemId);
      const response = await fetch(`http://localhost:8080/api/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        fetchAllData();
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item');
    } finally {
      setActionLoading(null);
    }
  };

  // Verify/Reject claim
  const updateClaimStatus = async (claimId, verified) => {
    try {
      const response = await fetch(`http://localhost:8080/api/claims/${claimId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verified),
      });
      
      if (response.ok) {
        fetchClaims();
      }
    } catch (error) {
      console.error('Error updating claim:', error);
      alert('Error updating claim');
    }
  };

  // Filter items based on status
  const filteredItems = filterStatus === 'all' 
    ? items 
    : items.filter(item => item.status === filterStatus);

  // Filter claims based on verification status
  const filteredClaims = filterStatus === 'all'
    ? claims
    : filterStatus === 'pending'
    ? claims.filter(claim => !claim.verified)
    : filterStatus === 'verified'
    ? claims.filter(claim => claim.verified)
    : claims;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilterStatus('all');
    if (tab === 'claims') {
      fetchClaims();
    } else if (tab === 'items') {
      fetchAllData();
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'CLAIMED':
      case 'verified':
        return <FaCheckCircle className="status-icon success" />;
      case 'RETURNED':
        return <FaCheck className="status-icon success" />;
      case 'PENDING':
        return <FaExclamationTriangle className="status-icon warning" />;
      case 'LOST':
      case 'FOUND':
        return <FaClock className="status-icon pending" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  const getStatusBadge = (status) => {
    let className = 'status-badge ';
    switch(status) {
      case 'CLAIMED':
      case 'verified':
        className += 'claimed';
        return <span className={className}>✓ Claimed/Verified</span>;
      case 'RETURNED':
        className += 'returned';
        return <span className={className}>✓ Returned</span>;
      case 'PENDING':
        className += 'pending-approval';
        return <span className={className}>⏳ Pending Approval</span>;
      case 'REJECTED':
        className += 'rejected';
        return <span className={className}>✗ Rejected</span>;
      case 'LOST':
        className += 'lost';
        return <span className={className}>● Lost</span>;
      case 'FOUND':
        className += 'found';
        return <span className={className}>● Found</span>;
      default:
        className += 'pending';
        return <span className={className}>⏱ Pending</span>;
    }
  };

  if (!user || user.role?.toLowerCase() !== 'admin') {
    return (
      <div className="admin-dashboard">
        <div className="unauthorized-message">
          <h2>Access Denied</h2>
          <p>You do not have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p className="admin-welcome">Welcome, {user.fname}! Manage all reported items and claims.</p>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <FaBox className="stat-icon" />
            <div className="stat-info">
              <span className="stat-number">{stats.total || items.length}</span>
              <span className="stat-label">Total Items</span>
            </div>
          </div>
          <div className="admin-stat-card pending">
            <FaExclamationTriangle className="stat-icon" />
            <div className="stat-info">
              <span className="stat-number">{stats.pending || pendingItems.length}</span>
              <span className="stat-label">Pending Approval</span>
            </div>
          </div>
          <div className="admin-stat-card lost">
            <FaClock className="stat-icon" />
            <div className="stat-info">
              <span className="stat-number">{stats.lost || 0}</span>
              <span className="stat-label">Lost Items</span>
            </div>
          </div>
          <div className="admin-stat-card found">
            <FaCheckCircle className="stat-icon" />
            <div className="stat-info">
              <span className="stat-number">{stats.found || 0}</span>
              <span className="stat-label">Found Items</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => handleTabChange('pending')}
          >
            <FaExclamationTriangle /> Pending ({pendingItems.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'items' ? 'active' : ''}`}
            onClick={() => handleTabChange('items')}
          >
            <FaBox /> Items ({items.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'claims' ? 'active' : ''}`}
            onClick={() => handleTabChange('claims')}
          >
            <FaClipboardCheck /> Claims ({claims.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            <FaUsers /> Users
          </button>
        </div>

        {/* Filter Controls (for items and claims tabs) */}
        {(activeTab === 'items' || activeTab === 'claims') && (
          <div className="admin-filters">
            {activeTab === 'items' ? (
              <>
                <button 
                  className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  All Items
                </button>
                <button 
                  className={`filter-btn ${filterStatus === 'LOST' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('LOST')}
                >
                  Lost Items
                </button>
                <button 
                  className={`filter-btn ${filterStatus === 'FOUND' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('FOUND')}
                >
                  Found Items
                </button>
                <button 
                  className={`filter-btn ${filterStatus === 'CLAIMED' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('CLAIMED')}
                >
                  Claimed Items
                </button>
                <button 
                  className={`filter-btn ${filterStatus === 'RETURNED' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('RETURNED')}
                >
                  Returned Items
                </button>
              </>
            ) : (
              <>
                <button 
                  className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  All Claims
                </button>
                <button 
                  className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('pending')}
                >
                  Pending Claims
                </button>
                <button 
                  className={`filter-btn ${filterStatus === 'verified' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('verified')}
                >
                  Verified Claims
                </button>
              </>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading data...</p>
          </div>
        )}

        {/* Pending Tab - NEW */}
        {activeTab === 'pending' && !loading && (
          <div className="admin-content">
            <div className="pending-section-header">
              <h2>Items Awaiting Approval</h2>
              <p>Review and approve or reject newly reported items</p>
            </div>
            
            {pendingItems.length === 0 ? (
              <div className="empty-state">
                <FaCheckCircle className="empty-icon" />
                <p>No pending items to review!</p>
              </div>
            ) : (
              <div className="items-grid">
                {pendingItems.map(item => (
                  <div key={item.itemId} className="item-card pending-item">
                    <div className="item-image-container">
                      {item.imageUrl && (
                        <img 
                          src={`http://localhost:8080${item.imageUrl}`} 
                          alt={item.itemTitle} 
                          className="item-image" 
                        />
                      )}
                      <div className="status-overlay">
                        {getStatusIcon('PENDING')}
                        {getStatusBadge('PENDING')}
                      </div>
                    </div>

                    <div className="item-content">
                      <h3>{item.itemTitle}</h3>
                      <p className="item-desc">{item.itemDesc}</p>
                      
                      <div className="item-details">
                        <p><strong>Location:</strong> {item.location}</p>
                        <p><strong>Date:</strong> {new Date(item.dateReport).toLocaleDateString()}</p>
                        <p><strong>Reporter:</strong> {item.user?.fName || item.userName} {item.user?.lName || ''}</p>
                        <p><strong>Reported as:</strong> {item.originalStatus || 'LOST/FOUND'}</p>
                      </div>

                      <div className="item-actions pending-actions">
                        <button 
                          className="action-btn approve-btn"
                          onClick={() => approveItem(item.itemId, 'LOST')}
                          disabled={actionLoading === item.itemId}
                        >
                          <FaCheck /> Approve as Lost
                        </button>
                        <button 
                          className="action-btn approve-btn found"
                          onClick={() => approveItem(item.itemId, 'FOUND')}
                          disabled={actionLoading === item.itemId}
                        >
                          <FaCheck /> Approve as Found
                        </button>
                        <button 
                          className="action-btn reject-btn"
                          onClick={() => rejectItem(item.itemId)}
                          disabled={actionLoading === item.itemId}
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && !loading && (
          <div className="admin-content">
            {filteredItems.length === 0 ? (
              <div className="empty-state">
                <p>No items found</p>
              </div>
            ) : (
              <div className="items-grid">
                {filteredItems.map(item => (
                  <div key={item.itemId} className="item-card">
                    <div className="item-image-container">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:8080${item.imageUrl}`} 
                          alt={item.itemTitle} 
                          className="item-image" 
                        />
                      )}
                      <div className="status-overlay">
                        {getStatusIcon(item.status)}
                        {getStatusBadge(item.status)}
                      </div>
                    </div>

                    <div className="item-content">
                      <h3>{item.itemTitle}</h3>
                      <p className="item-desc">{item.itemDesc}</p>
                      
                      <div className="item-details">
                        <p><strong>Location:</strong> {item.location}</p>
                        <p><strong>Date:</strong> {new Date(item.dateReport).toLocaleDateString()}</p>
                        <p><strong>Reporter:</strong> {item.user?.fName} {item.user?.lName}</p>
                        <p><strong>Category:</strong> {item.category?.categoryName}</p>
                        <p><strong>Department:</strong> {item.department?.depName}</p>
                      </div>

                      <div className="item-actions">
                        <button 
                          className="action-btn view-btn"
                          onClick={() => setSelectedItem(item)}
                        >
                          <FaEye /> View
                        </button>
                        
                        {item.status !== 'CLAIMED' && item.status !== 'RETURNED' && item.status !== 'PENDING' && (
                          <div className="status-change-buttons">
                            <button 
                              className="action-btn approve-btn"
                              onClick={() => updateItemStatus(item.itemId, 'CLAIMED')}
                              title="Mark as Claimed"
                              disabled={actionLoading === item.itemId}
                            >
                              <FaCheck /> Approve
                            </button>
                            <button 
                              className="action-btn reject-btn"
                              onClick={() => updateItemStatus(item.itemId, 'RETURNED')}
                              title="Mark as Returned"
                              disabled={actionLoading === item.itemId}
                            >
                              <FaTimes /> Return
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Claims Tab */}
        {activeTab === 'claims' && !loading && (
          <div className="admin-content">
            {filteredClaims.length === 0 ? (
              <div className="empty-state">
                <p>No claims found</p>
              </div>
            ) : (
              <div className="claims-list">
                {filteredClaims.map(claim => (
                  <div key={claim.claimId} className="claim-card">
                    <div className="claim-header">
                      <div className="claim-status">
                        {claim.verified ? (
                          <span className="verified-badge">✓ Verified</span>
                        ) : (
                          <span className="pending-badge">⏱ Pending</span>
                        )}
                      </div>
                      <p className="claim-date">
                        {new Date(claim.claimDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="claim-details">
                      <div className="claim-section">
                        <h4>Item Information</h4>
                        <p><strong>Title:</strong> {claim.item?.itemTitle}</p>
                        <p><strong>Status:</strong> {claim.item?.status}</p>
                        <p><strong>Description:</strong> {claim.item?.itemDesc}</p>
                      </div>

                      <div className="claim-section">
                        <h4>Claimant Information</h4>
                        <p><strong>Name:</strong> {claim.user?.fName} {claim.user?.lName}</p>
                        <p><strong>Email:</strong> {claim.user?.email}</p>
                        <p><strong>Contact:</strong> {claim.user?.contactNo}</p>
                      </div>

                      <div className="claim-section">
                        <h4>Claim Status</h4>
                        <p><strong>Status:</strong> {claim.status}</p>
                        <p><strong>Verified:</strong> {claim.verified ? 'Yes' : 'No'}</p>
                        {claim.rejectionReason && (
                          <p><strong>Rejection Reason:</strong> {claim.rejectionReason}</p>
                        )}
                      </div>
                    </div>

                    {!claim.verified && (
                      <div className="claim-actions">
                        <button 
                          className="action-btn approve-btn"
                          onClick={() => updateClaimStatus(claim.claimId, true)}
                        >
                          <FaCheck /> Approve Claim
                        </button>
                        <button 
                          className="action-btn reject-btn"
                          onClick={() => updateClaimStatus(claim.claimId, false)}
                        >
                          <FaTimes /> Reject Claim
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab - NEW */}
        {activeTab === 'users' && !loading && (
          <div className="admin-content users-tab-content">
            <UserManagementTab />
          </div>
        )}

        {/* Item Details Modal */}
        {selectedItem && (
          <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedItem(null)}>✕</button>
              
              <div className="modal-header">
                <h2>{selectedItem.itemTitle}</h2>
                {getStatusBadge(selectedItem.status)}
              </div>

              {selectedItem.imageUrl && (
                <img 
                  src={selectedItem.imageUrl.startsWith('http') ? selectedItem.imageUrl : `http://localhost:8080${selectedItem.imageUrl}`} 
                  alt={selectedItem.itemTitle} 
                  className="modal-image" 
                />
              )}

              <div className="modal-details">
                <div className="detail-group">
                  <h3>Description</h3>
                  <p>{selectedItem.itemDesc}</p>
                </div>

                <div className="detail-group">
                  <h3>Location Information</h3>
                  <p><strong>Location:</strong> {selectedItem.location}</p>
                </div>

                <div className="detail-group">
                  <h3>Reporter Information</h3>
                  <p><strong>Name:</strong> {selectedItem.user?.fName} {selectedItem.user?.lName}</p>
                  <p><strong>Email:</strong> {selectedItem.user?.email}</p>
                  <p><strong>Contact:</strong> {selectedItem.user?.contactNo}</p>
                </div>

                <div className="detail-group">
                  <h3>Item Classification</h3>
                  <p><strong>Category:</strong> {selectedItem.category?.categoryName}</p>
                  <p><strong>Department:</strong> {selectedItem.department?.depName}</p>
                  <p><strong>Status:</strong> {selectedItem.status}</p>
                  <p><strong>Reported On:</strong> {new Date(selectedItem.dateReport).toLocaleString()}</p>
                </div>

                <div className="detail-group">
                  <h3>Claims on this Item</h3>
                  {selectedItem.claims && selectedItem.claims.length > 0 ? (
                    <ul className="claims-list-modal">
                      {selectedItem.claims.map(claim => (
                        <li key={claim.claimId}>
                          {claim.user?.fName} {claim.user?.lName} - {claim.status}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No claims on this item</p>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                {selectedItem.status !== 'CLAIMED' && selectedItem.status !== 'RETURNED' && (
                  <>
                    <button 
                      className="action-btn approve-btn"
                      onClick={() => {
                        updateItemStatus(selectedItem.itemId, 'CLAIMED');
                      }}
                    >
                      <FaCheck /> Mark as Claimed
                    </button>
                    <button 
                      className="action-btn reject-btn"
                      onClick={() => {
                        updateItemStatus(selectedItem.itemId, 'RETURNED');
                      }}
                    >
                      <FaTimes /> Mark as Returned
                    </button>
                  </>
                )}
                <button 
                  className="action-btn close-btn"
                  onClick={() => setSelectedItem(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;