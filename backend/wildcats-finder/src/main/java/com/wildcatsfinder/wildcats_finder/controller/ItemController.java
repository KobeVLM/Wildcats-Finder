package com.wildcatsfinder.wildcats_finder.controller;

import com.wildcatsfinder.wildcats_finder.entity.ItemEntity;
import com.wildcatsfinder.wildcats_finder.entity.ItemEntity.ItemStatus;
import com.wildcatsfinder.wildcats_finder.entity.UserEntity;
import com.wildcatsfinder.wildcats_finder.entity.CategoryEntity;
import com.wildcatsfinder.wildcats_finder.entity.DepartmentEntity;
import com.wildcatsfinder.wildcats_finder.service.ItemService;
import com.wildcatsfinder.wildcats_finder.service.UserService;
import com.wildcatsfinder.wildcats_finder.service.CategoryService;
import com.wildcatsfinder.wildcats_finder.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*") // For React frontend
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private UserService userService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private DepartmentService departmentService;

    // DTO for item report form submission
    public static class ItemReportRequest {
        private String itemTitle;
        private String itemDesc;
        private String location;
        private String imageUrl;
        private ItemStatus status; // LOST or FOUND
        private Long userId;
        private Long categoryId;
        private Long departmentId;

        // Constructors
        public ItemReportRequest() {
        }

        // Getters and Setters
        public String getItemTitle() {
            return itemTitle;
        }

        public void setItemTitle(String itemTitle) {
            this.itemTitle = itemTitle;
        }

        public String getItemDesc() {
            return itemDesc;
        }

        public void setItemDesc(String itemDesc) {
            this.itemDesc = itemDesc;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public ItemStatus getStatus() {
            return status;
        }

        public void setStatus(ItemStatus status) {
            this.status = status;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Long getCategoryId() {
            return categoryId;
        }

        public void setCategoryId(Long categoryId) {
            this.categoryId = categoryId;
        }

        public Long getDepartmentId() {
            return departmentId;
        }

        public void setDepartmentId(Long departmentId) {
            this.departmentId = departmentId;
        }
    }

    // CREATE: Report a lost or found item
    // POST /api/items/report
    // Matches your item report form fields exactly
    @PostMapping("/report")
    public ResponseEntity<?> reportItem(@RequestBody ItemReportRequest request) {
        try {
            // Validate required fields
            if (request.getItemTitle() == null || request.getItemTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Item title is required");
            }
            if (request.getStatus() == null) {
                return ResponseEntity.badRequest().body("Item status is required");
            }
            if (request.getUserId() == null) {
                return ResponseEntity.badRequest().body("User ID is required");
            }
            if (request.getCategoryId() == null) {
                return ResponseEntity.badRequest().body("Category ID is required");
            }
            if (request.getDepartmentId() == null) {
                return ResponseEntity.badRequest().body("Department ID is required");
            }

            // Get related entities
            UserEntity user = userService.getUserById(request.getUserId());
            CategoryEntity category = categoryService.getCategoryById(request.getCategoryId());
            DepartmentEntity department = departmentService.getDepartmentById(request.getDepartmentId());

            // Create new item entity
            ItemEntity item = new ItemEntity();
            item.setItemTitle(request.getItemTitle());
            item.setItemDesc(request.getItemDesc());
            item.setLocation(request.getLocation());
            item.setImageUrl(request.getImageUrl());
            item.setStatus(request.getStatus());
            item.setDateReport(LocalDateTime.now()); // Auto-set current timestamp
            item.setUser(user);
            item.setCategory(category);
            item.setDepartment(department);

            // Save the item
            ItemEntity savedItem = itemService.createItem(item);
            return ResponseEntity.ok(savedItem);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error reporting item: " + e.getMessage());
        }
    }

    // READ: Get all items for dashboard
    // GET /api/items
    @GetMapping
    public ResponseEntity<List<ItemEntity>> getAllItems() {
        try {
            List<ItemEntity> items = itemService.getAllItemsForDashboard();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get items by status (LOST, FOUND, CLAIMED, RETURNED)
    // GET /api/items/status/{status}
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ItemEntity>> getItemsByStatus(@PathVariable ItemStatus status) {
        try {
            List<ItemEntity> items = itemService.getItemsByStatus(status);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get lost items
    // GET /api/items/lost
    @GetMapping("/lost")
    public ResponseEntity<List<ItemEntity>> getLostItems() {
        return getItemsByStatus(ItemStatus.LOST);
    }

    // READ: Get found items
    // GET /api/items/found
    @GetMapping("/found")
    public ResponseEntity<List<ItemEntity>> getFoundItems() {
        return getItemsByStatus(ItemStatus.FOUND);
    }

    // READ: Get item by ID
    // GET /api/items/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {
        try {
            ItemEntity item = itemService.getItemById(id);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Item not found: " + e.getMessage());
        }
    }

    // READ: Get items by user (for user's profile/items page)
    // GET /api/items/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ItemEntity>> getItemsByUserId(@PathVariable Long userId) {
        try {
            List<ItemEntity> items = itemService.getItemsByUserId(userId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get items by category
    // GET /api/items/category/{categoryId}
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ItemEntity>> getItemsByCategory(@PathVariable Long categoryId) {
        try {
            List<ItemEntity> items = itemService.getItemsByCategoryId(categoryId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get items by department
    // GET /api/items/department/{departmentId}
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<ItemEntity>> getItemsByDepartment(@PathVariable Long departmentId) {
        try {
            List<ItemEntity> items = itemService.getItemsByDepartmentId(departmentId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // SEARCH: Search items by title or location
    // GET /api/items/search?title={title}&location={location}
    @GetMapping("/search")
    public ResponseEntity<List<ItemEntity>> searchItems(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location) {
        try {
            List<ItemEntity> items = itemService.searchItems(title, location);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // UPDATE: Update item status (for claims processing)
    // PUT /api/items/{id}/status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateItemStatus(@PathVariable Long id, @RequestBody ItemStatus newStatus) {
        try {
            ItemEntity updatedItem = itemService.updateItemStatus(id, newStatus);
            return ResponseEntity.ok(updatedItem);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error updating item status: " + e.getMessage());
        }
    }

    // UPDATE: Update entire item
    // PUT /api/items/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @RequestBody ItemReportRequest request) {
        try {
            // Get existing item
            ItemEntity existingItem = itemService.getItemById(id);

            // Get related entities
            UserEntity user = userService.getUserById(request.getUserId());
            CategoryEntity category = categoryService.getCategoryById(request.getCategoryId());
            DepartmentEntity department = departmentService.getDepartmentById(request.getDepartmentId());

            // Update fields
            existingItem.setItemTitle(request.getItemTitle());
            existingItem.setItemDesc(request.getItemDesc());
            existingItem.setLocation(request.getLocation());
            existingItem.setImageUrl(request.getImageUrl());
            existingItem.setStatus(request.getStatus());
            existingItem.setUser(user);
            existingItem.setCategory(category);
            existingItem.setDepartment(department);

            // Save updated item
            ItemEntity updatedItem = itemService.updateItem(id, existingItem);
            return ResponseEntity.ok(updatedItem);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error updating item: " + e.getMessage());
        }
    }

    // DELETE: Delete item
    // DELETE /api/items/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        try {
            String result = itemService.deleteItem(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error deleting item: " + e.getMessage());
        }
    }

    // ADMIN: Get pending items (items awaiting approval)
    // GET /api/items/pending
    @GetMapping("/pending")
    public ResponseEntity<List<ItemEntity>> getPendingItems() {
        try {
            List<ItemEntity> items = itemService.getItemsByStatus(ItemStatus.PENDING);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // ADMIN: Approve item (change status from PENDING to ACTIVE)
    // PUT /api/items/{id}/approve
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveItem(@PathVariable Long id) {
        try {
            ItemEntity item = itemService.updateItemStatus(id, ItemStatus.ACTIVE);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error approving item: " + e.getMessage());
        }
    }

    // ADMIN: Reject item (change status to REJECTED)
    // PUT /api/items/{id}/reject
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectItem(@PathVariable Long id) {
        try {
            ItemEntity item = itemService.updateItemStatus(id, ItemStatus.REJECTED);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error rejecting item: " + e.getMessage());
        }
    }
}