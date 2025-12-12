import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../context/UserContext';
import './AdminDashboard.css';

import {
  FaUser,
  FaUserShield,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaUsers
} from "react-icons/fa";

function AdminDashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Check if user is logged in and has admin role
  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== 'admin') {
      navigate("/home");
    }
  }, [user, navigate]);

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const updateUser = async (userId, userData) => {
    setSaveLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        fetchUsers();
        setEditingUser(null);
        setSelectedUser(null);
      } else {
        alert('Error updating user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    } finally {
      setSaveLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUsers();
        setShowDeleteConfirm(null);
        setSelectedUser(null);
      } else {
        alert('Error deleting user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  // Filter and search users
  const filteredUsers = users.filter(u => {
    const matchesRole = filterRole === 'all' || u.role?.toLowerCase() === filterRole.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      u.fName?.toLowerCase().includes(searchLower) ||
      u.lName?.toLowerCase().includes(searchLower) ||
      u.email?.toLowerCase().includes(searchLower) ||
      u.username?.toLowerCase().includes(searchLower);
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (role) => {
    const isAdmin = role?.toLowerCase() === 'admin';
    return (
      <span className={`role-badge ${isAdmin ? 'admin' : 'user'}`}>
        {isAdmin ? <FaUserShield /> : <FaUser />}
        {role || 'USER'}
      </span>
    );
  };

  const getUserInitials = (userData) => {
    let initials = "";
    if (userData.fName) initials += userData.fName.charAt(0).toUpperCase();
    if (userData.lName) initials += userData.lName.charAt(0).toUpperCase();
    return initials || userData.username?.charAt(0).toUpperCase() || "U";
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
          <h1><FaUsers style={{ marginRight: '15px' }} />User Management</h1>
          <p className="admin-welcome">Welcome, {user.fname}! Manage all registered users.</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="admin-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterRole === 'all' ? 'active' : ''}`}
              onClick={() => setFilterRole('all')}
            >
              All Users ({users.length})
            </button>
            <button
              className={`filter-btn ${filterRole === 'admin' ? 'active' : ''}`}
              onClick={() => setFilterRole('admin')}
            >
              Admins ({users.filter(u => u.role?.toLowerCase() === 'admin').length})
            </button>
            <button
              className={`filter-btn ${filterRole === 'user' ? 'active' : ''}`}
              onClick={() => setFilterRole('user')}
            >
              Users ({users.filter(u => u.role?.toLowerCase() === 'user').length})
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        )}

        {/* Users Table */}
        {!loading && (
          <div className="admin-content">
            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <FaUsers style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.5 }} />
                <p>No users found</p>
              </div>
            ) : (
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.userId} className="user-row">
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">
                              {getUserInitials(u)}
                            </div>
                            <div className="user-name-details">
                              <span className="user-fullname">
                                {u.fName} {u.mName ? u.mName.charAt(0) + '.' : ''} {u.lName}
                              </span>
                              <span className="user-username">@{u.username}</span>
                            </div>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>{u.contactNo || '-'}</td>
                        <td>{getRoleBadge(u.role)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn view-btn"
                              onClick={() => setSelectedUser(u)}
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="action-btn edit-btn"
                              onClick={() => setEditingUser({ ...u })}
                              title="Edit User"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => setShowDeleteConfirm(u)}
                              title="Delete User"
                              disabled={u.userId === user.userId}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* View User Modal */}
        {selectedUser && !editingUser && (
          <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedUser(null)}>✕</button>

              <div className="modal-header">
                <h2>User Details</h2>
                {getRoleBadge(selectedUser.role)}
              </div>

              <div className="modal-details">
                <div className="user-profile-header">
                  <div className="large-avatar">
                    {getUserInitials(selectedUser)}
                  </div>
                  <div className="user-profile-name">
                    <h3>{selectedUser.fName} {selectedUser.mName || ''} {selectedUser.lName}</h3>
                    <p>@{selectedUser.username}</p>
                  </div>
                </div>

                <div className="detail-group">
                  <h3>Contact Information</h3>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Phone:</strong> {selectedUser.contactNo || 'Not provided'}</p>
                </div>

                <div className="detail-group">
                  <h3>Account Information</h3>
                  <p><strong>User ID:</strong> {selectedUser.userId}</p>
                  <p><strong>Role:</strong> {selectedUser.role || 'USER'}</p>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="action-btn edit-btn-large"
                  onClick={() => setEditingUser({ ...selectedUser })}
                >
                  <FaEdit /> Edit User
                </button>
                <button
                  className="action-btn close-btn"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <div className="modal-overlay" onClick={() => setEditingUser(null)}>
            <div className="modal-content edit-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setEditingUser(null)}>✕</button>

              <div className="modal-header">
                <h2>Edit User</h2>
              </div>

              <div className="modal-details">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  updateUser(editingUser.userId, {
                    fName: editingUser.fName,
                    mName: editingUser.mName,
                    lName: editingUser.lName,
                    email: editingUser.email,
                    contactNo: editingUser.contactNo,
                    role: editingUser.role
                  });
                }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={editingUser.fName || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, fName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Middle Name</label>
                      <input
                        type="text"
                        value={editingUser.mName || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, mName: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={editingUser.lName || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, lName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editingUser.email || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Number</label>
                    <input
                      type="text"
                      value={editingUser.contactNo || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, contactNo: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={editingUser.role || 'USER'}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>

                  <div className="modal-actions">
                    <button type="submit" className="action-btn save-btn" disabled={saveLoading}>
                      {saveLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      className="action-btn close-btn"
                      onClick={() => setEditingUser(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
            <div className="modal-content delete-confirm-modal" onClick={e => e.stopPropagation()}>
              <div className="delete-confirm-content">
                <FaTrash className="delete-icon" />
                <h2>Delete User?</h2>
                <p>Are you sure you want to delete <strong>{showDeleteConfirm.fName} {showDeleteConfirm.lName}</strong>?</p>
                <p className="delete-warning">This action cannot be undone.</p>

                <div className="delete-actions">
                  <button
                    className="action-btn delete-confirm-btn"
                    onClick={() => deleteUser(showDeleteConfirm.userId)}
                  >
                    Yes, Delete
                  </button>
                  <button
                    className="action-btn close-btn"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;