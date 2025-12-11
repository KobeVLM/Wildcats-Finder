import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import './NotificationBell.css';

/**
 * NotificationBell - Displays notification icon with unread badge
 * 
 * Features:
 * - Shows unread count badge
 * - Dropdown with notification list
 * - Mark as read on click
 * - Mark all as read button
 */
const NotificationBell = () => {
    const { 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead, 
        deleteNotification,
        fetchNotifications 
    } = useNotifications();
    
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        if (!isOpen) {
            fetchNotifications(); // Refresh when opening
        }
        setIsOpen(!isOpen);
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            await markAsRead(notification.notificationId);
        }
        // Could navigate to related item/claim here
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'CLAIM_RECEIVED':
                return '📥';
            case 'CLAIM_APPROVED':
                return '✅';
            case 'CLAIM_REJECTED':
                return '❌';
            case 'ITEM_APPROVED':
                return '✓';
            case 'ITEM_REJECTED':
                return '✗';
            case 'MATCH_FOUND':
                return '🔍';
            default:
                return '🔔';
        }
    };

    return (
        <div className="notification-bell-container">
            <button className="notification-bell-button" onClick={toggleDropdown}>
                <span className="bell-icon">🔔</span>
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="notification-overlay" onClick={() => setIsOpen(false)} />
                    <div className="notification-dropdown">
                        <div className="notification-header">
                            <h3>Notifications</h3>
                            {unreadCount > 0 && (
                                <button 
                                    className="mark-all-read-btn"
                                    onClick={markAllAsRead}
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="notification-list">
                            {notifications.length === 0 ? (
                                <div className="notification-empty">
                                    <span>🔔</span>
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.notificationId}
                                        className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <span className="notification-icon">
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                        <div className="notification-content">
                                            <h4>{notification.title}</h4>
                                            <p>{notification.message}</p>
                                            <span className="notification-time">
                                                {formatTime(notification.createdAt)}
                                            </span>
                                        </div>
                                        <button
                                            className="notification-delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.notificationId);
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
