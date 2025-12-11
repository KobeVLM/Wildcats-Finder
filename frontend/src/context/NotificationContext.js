import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';
import { UserContext } from './UserContext';

// Create the context
const NotificationContext = createContext(null);

/**
 * NotificationProvider - Provides notification state to the entire app
 * 
 * Features:
 * - Automatic polling for new notifications
 * - Unread count for badge display
 * - Methods for marking as read
 */
export const NotificationProvider = ({ children }) => {
    const { user } = useContext(UserContext);
    const isAuthenticated = !!user;
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    /**
     * Fetch notifications for current user
     */
    const fetchNotifications = useCallback(async () => {
        if (!user?.userId) return;
        
        try {
            setLoading(true);
            const data = await notificationService.getNotifications(user.userId);
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.userId]);

    /**
     * Fetch unread count
     */
    const fetchUnreadCount = useCallback(async () => {
        if (!user?.userId) return;
        
        try {
            const count = await notificationService.getUnreadCount(user.userId);
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    }, [user?.userId]);

    /**
     * Mark a notification as read
     */
    const markAsRead = async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId);
            setNotifications(prev => 
                prev.map(n => 
                    n.notificationId === notificationId 
                        ? { ...n, isRead: true } 
                        : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    /**
     * Mark all notifications as read
     */
    const markAllAsRead = async () => {
        if (!user?.userId) return;
        
        try {
            await notificationService.markAllAsRead(user.userId);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    /**
     * Delete a notification
     */
    const deleteNotification = async (notificationId) => {
        try {
            await notificationService.deleteNotification(notificationId);
            setNotifications(prev => 
                prev.filter(n => n.notificationId !== notificationId)
            );
            // Update unread count if deleted notification was unread
            const wasUnread = notifications.find(n => n.notificationId === notificationId && !n.isRead);
            if (wasUnread) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    // Fetch notifications when user logs in
    useEffect(() => {
        if (isAuthenticated && user?.userId) {
            fetchNotifications();
            fetchUnreadCount();
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [isAuthenticated, user?.userId, fetchNotifications, fetchUnreadCount]);

    // Poll for new notifications every 30 seconds
    useEffect(() => {
        if (!isAuthenticated || !user?.userId) return;

        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, [isAuthenticated, user?.userId, fetchUnreadCount]);

    const value = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

/**
 * useNotifications hook - Access notification context from any component
 */
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export default NotificationContext;
