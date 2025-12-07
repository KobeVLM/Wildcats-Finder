package com.wildcatsfinder.wildcats_finder.controller;

import com.wildcatsfinder.wildcats_finder.entity.NotificationEntity;
import com.wildcatsfinder.wildcats_finder.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*") // For React frontend
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // READ: Get all notifications for a user
    // GET /api/notifications/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationEntity>> getNotificationsByUserId(@PathVariable Long userId) {
        try {
            List<NotificationEntity> notifications = notificationService.getNotificationsByUserId(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get unread notifications for a user
    // GET /api/notifications/user/{userId}/unread
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationEntity>> getUnreadNotifications(@PathVariable Long userId) {
        try {
            List<NotificationEntity> notifications = notificationService.getUnreadNotificationsByUserId(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Count unread notifications for a user
    // GET /api/notifications/user/{userId}/count
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> countUnreadNotifications(@PathVariable Long userId) {
        try {
            Long count = notificationService.countUnreadNotifications(userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0L);
        }
    }

    // UPDATE: Mark notification as read
    // PUT /api/notifications/{id}/read
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            NotificationEntity notification = notificationService.markAsRead(id);
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error marking notification as read: " + e.getMessage());
        }
    }

    // UPDATE: Mark all notifications as read for a user
    // PUT /api/notifications/user/{userId}/read-all
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<?> markAllAsRead(@PathVariable Long userId) {
        try {
            notificationService.markAllAsRead(userId);
            return ResponseEntity.ok("All notifications marked as read");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error marking notifications as read: " + e.getMessage());
        }
    }

    // DELETE: Delete notification
    // DELETE /api/notifications/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        try {
            String result = notificationService.deleteNotification(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error deleting notification: " + e.getMessage());
        }
    }

    // DELETE: Delete all notifications for a user
    // DELETE /api/notifications/user/{userId}
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> deleteAllNotifications(@PathVariable Long userId) {
        try {
            String result = notificationService.deleteAllNotifications(userId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting notifications: " + e.getMessage());
        }
    }
}
