import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { FaUsers, FaUserSlash, FaUserCheck, FaTrash, FaSearch, FaBan, FaUndo } from 'react-icons/fa';
import './UserManagementTab.css';

/**
 * UserManagementTab - Admin component for managing users
 */
function UserManagementTab() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [stats, setStats] = useState({ total: 0, admins: 0, users: 0, suspended: 0 });
    const [actionLoading, setActionLoading] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch users and stats
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [usersData, statsData] = await Promise.all([
                    userService.getAllUsers(),
                    userService.getUserStats()
                ]);
                setUsers(usersData);
                setFilteredUsers(usersData);
                setStats(statsData);
            } catch (error) {
                console.error('Error fetching users:', error);
                setMessage({ type: 'error', text: 'Failed to load users' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Apply filters
    useEffect(() => {
        let result = [...users];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(user =>
                user.username?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query) ||
                user.fname?.toLowerCase().includes(query) ||
                user.lname?.toLowerCase().includes(query)
            );
        }

        // Role filter
        if (filterRole !== 'ALL') {
            result = result.filter(user => user.role?.toUpperCase() === filterRole);
        }

        // Status filter
        if (filterStatus === 'SUSPENDED') {
            result = result.filter(user => user.suspended);
        } else if (filterStatus === 'ACTIVE') {
            result = result.filter(user => !user.suspended);
        }

        setFilteredUsers(result);
    }, [users, searchQuery, filterRole, filterStatus]);

    // Suspend user
    const handleSuspend = async (userId) => {
        const reason = prompt('Enter suspension reason:');
        if (!reason) return;

        try {
            setActionLoading(userId);
            await userService.suspendUser(userId, reason);
            
            // Update local state
            setUsers(prev => prev.map(u => 
                u.userId === userId ? { ...u, suspended: true, suspendReason: reason } : u
            ));
            setStats(prev => ({ ...prev, suspended: prev.suspended + 1 }));
            setMessage({ type: 'success', text: 'User suspended successfully' });
        } catch (error) {
            console.error('Error suspending user:', error);
            setMessage({ type: 'error', text: 'Failed to suspend user' });
        } finally {
            setActionLoading(null);
        }
    };

    // Unsuspend user
    const handleUnsuspend = async (userId) => {
        try {
            setActionLoading(userId);
            await userService.unsuspendUser(userId);
            
            // Update local state
            setUsers(prev => prev.map(u => 
                u.userId === userId ? { ...u, suspended: false, suspendReason: null } : u
            ));
            setStats(prev => ({ ...prev, suspended: prev.suspended - 1 }));
            setMessage({ type: 'success', text: 'User unsuspended successfully' });
        } catch (error) {
            console.error('Error unsuspending user:', error);
            setMessage({ type: 'error', text: 'Failed to unsuspend user' });
        } finally {
            setActionLoading(null);
        }
    };

    // Delete user
    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            setActionLoading(userId);
            await userService.deleteUser(userId);
            
            // Update local state
            setUsers(prev => prev.filter(u => u.userId !== userId));
            setStats(prev => ({ ...prev, total: prev.total - 1 }));
            setMessage({ type: 'success', text: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            setMessage({ type: 'error', text: 'Failed to delete user' });
        } finally {
            setActionLoading(null);
        }
    };

    // Get full name
    const getFullName = (user) => {
        const name = [user.fname, user.mname, user.lname].filter(Boolean).join(' ');
        return name || user.username || 'Unknown';
    };

    return (
        <div className="user-management-tab">
            {/* Stats Cards */}
            <div className="user-stats-grid">
                <div className="user-stat-card">
                    <FaUsers className="stat-icon" />
                    <div className="stat-info">
                        <span className="stat-number">{stats.total}</span>
                        <span className="stat-label">Total Users</span>
                    </div>
                </div>
                <div className="user-stat-card admin">
                    <FaUserCheck className="stat-icon" />
                    <div className="stat-info">
                        <span className="stat-number">{stats.admins}</span>
                        <span className="stat-label">Admins</span>
                    </div>
                </div>
                <div className="user-stat-card regular">
                    <FaUsers className="stat-icon" />
                    <div className="stat-info">
                        <span className="stat-number">{stats.users}</span>
                        <span className="stat-label">Regular Users</span>
                    </div>
                </div>
                <div className="user-stat-card suspended">
                    <FaUserSlash className="stat-icon" />
                    <div className="stat-info">
                        <span className="stat-number">{stats.suspended}</span>
                        <span className="stat-label">Suspended</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="user-filters">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">Admins</option>
                    <option value="USER">Users</option>
                </select>
                
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                </select>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`user-message ${message.type}`}>
                    {message.text}
                    <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
                </div>
            )}

            {/* Users Table */}
            <div className="users-table-container">
                {loading ? (
                    <div className="loading-users">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="no-users">No users found</div>
                ) : (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.userId} className={user.suspended ? 'suspended' : ''}>
                                    <td className="user-name-cell">
                                        <div className="user-avatar">
                                            {(user.fname?.charAt(0) || user.username?.charAt(0) || 'U').toUpperCase()}
                                        </div>
                                        <span>{getFullName(user)}</span>
                                    </td>
                                    <td>{user.email || user.username}</td>
                                    <td>
                                        <span className={`role-badge ${user.role?.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        {user.suspended ? (
                                            <span className="status-badge suspended">Suspended</span>
                                        ) : (
                                            <span className="status-badge active">Active</span>
                                        )}
                                    </td>
                                    <td className="actions-cell">
                                        {user.role?.toUpperCase() !== 'ADMIN' && (
                                            <>
                                                {user.suspended ? (
                                                    <button 
                                                        className="action-btn unsuspend"
                                                        onClick={() => handleUnsuspend(user.userId)}
                                                        disabled={actionLoading === user.userId}
                                                        title="Unsuspend"
                                                    >
                                                        <FaUndo />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        className="action-btn suspend"
                                                        onClick={() => handleSuspend(user.userId)}
                                                        disabled={actionLoading === user.userId}
                                                        title="Suspend"
                                                    >
                                                        <FaBan />
                                                    </button>
                                                )}
                                                <button 
                                                    className="action-btn delete"
                                                    onClick={() => handleDelete(user.userId)}
                                                    disabled={actionLoading === user.userId}
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default UserManagementTab;
