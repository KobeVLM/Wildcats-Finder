package com.wildcatsfinder.wildcats_finder.controller;

import com.wildcatsfinder.wildcats_finder.entity.ItemEntity;
import com.wildcatsfinder.wildcats_finder.entity.ItemEntity.ItemStatus;
import com.wildcatsfinder.wildcats_finder.entity.UserEntity;
import com.wildcatsfinder.wildcats_finder.dto.ItemDTO;
import com.wildcatsfinder.wildcats_finder.entity.CategoryEntity;
import com.wildcatsfinder.wildcats_finder.entity.DepartmentEntity;
import com.wildcatsfinder.wildcats_finder.service.ItemService;
import com.wildcatsfinder.wildcats_finder.service.UserService;
import com.wildcatsfinder.wildcats_finder.service.CategoryService;
import com.wildcatsfinder.wildcats_finder.service.DepartmentService;
import com.wildcatsfinder.wildcats_finder.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private UserService userService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private FileStorageService fileStorageService;

    @PersistenceContext
    private EntityManager entityManager;

    // DTO for item report form submission
    public static class ItemReportRequest {
        private String itemTitle;
        private String itemDesc;
        private String location;
        private String imageUrl;
        private ItemStatus status;
        private Long userId;
        private Long categoryId;
        private Long departmentId;

        public ItemReportRequest() {}

        // Getters and Setters
        public String getItemTitle() { return itemTitle; }
        public void setItemTitle(String itemTitle) { this.itemTitle = itemTitle; }
        
        public String getItemDesc() { return itemDesc; }
        public void setItemDesc(String itemDesc) { this.itemDesc = itemDesc; }
        
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        
        public ItemStatus getStatus() { return status; }
        public void setStatus(ItemStatus status) { this.status = status; }
        
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    }

    // CREATE: Report a lost or found item with file upload
    @PostMapping("/report")
    public ResponseEntity<?> reportItem(
            @RequestParam("itemTitle") String itemTitle,
            @RequestParam("itemDesc") String itemDesc,
            @RequestParam("location") String location,
            @RequestParam("status") ItemStatus status,
            @RequestParam("userId") Long userId,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("departmentId") Long departmentId,
            @RequestParam("dateReport") String dateReport,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        try {
            // Validate required fields
            if (itemTitle == null || itemTitle.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Item title is required");
            }
            if (status == null) {
                return ResponseEntity.badRequest().body("Item status is required");
            }
            if (userId == null) {
                return ResponseEntity.badRequest().body("User ID is required");
            }
            if (categoryId == null) {
                return ResponseEntity.badRequest().body("Category ID is required");
            }
            if (departmentId == null) {
                return ResponseEntity.badRequest().body("Department ID is required");
            }
            
            // Get related entities
            UserEntity user = userService.getUserById(userId);
            CategoryEntity category = categoryService.getCategoryById(categoryId);
            DepartmentEntity department = departmentService.getDepartmentById(departmentId);
            
            // Handle file upload
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                String filename = fileStorageService.storeFile(image);
                imageUrl = "/api/items/images/" + filename;
            }
            
            // Create item
            ItemEntity item = new ItemEntity();
            item.setItemTitle(itemTitle);
            item.setItemDesc(itemDesc);
            item.setLocation(location);
            item.setImageUrl(imageUrl);
            item.setStatus(status);
            
            // Parse date
            if (dateReport != null && !dateReport.isEmpty()) {
                LocalDate localDate = LocalDate.parse(dateReport);
                item.setDateReport(localDate.atStartOfDay());
            } else {
                item.setDateReport(LocalDateTime.now());
            }
            
            item.setUser(user);
            item.setCategory(category);
            item.setDepartment(department);
            
            ItemEntity savedItem = itemService.createItem(item);
            return ResponseEntity.ok(new ItemDTO(savedItem));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error reporting item: " + e.getMessage());
        }
    }

    // Serve uploaded images
    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageBytes = fileStorageService.loadFile(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // CLAIM: Claim a found item
    @PostMapping("/{id}/claim")
    public ResponseEntity<?> claimItem(@PathVariable Long id, @RequestBody Map<String, Long> request) {
        try {
            Long claimantId = request.get("userId");
            if (claimantId == null) {
                return ResponseEntity.badRequest().body("User ID is required");
            }
            
            ItemEntity item = itemService.getItemById(id);
            
            // Check if item is FOUND
            if (item.getStatus() != ItemStatus.FOUND) {
                return ResponseEntity.badRequest().body("Only FOUND items can be claimed");
            }
            
            // Check if user is claiming their own item
            if (item.getUser().getUserId().equals(claimantId)) {
                return ResponseEntity.badRequest().body("You cannot claim your own item");
            }
            
            // Update status to CLAIMED
            item.setStatus(ItemStatus.CLAIMED);
            itemService.updateItem(id, item);
            
            return ResponseEntity.ok("Claim request submitted successfully");
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error claiming item: " + e.getMessage());
        }
    }

    // READ: Get all items for dashboard
    @GetMapping
    public ResponseEntity<List<ItemEntity>> getAllItems() {
        try {
            System.out.println("=== GET ALL ITEMS ENDPOINT CALLED ===");
            System.out.println("Calling itemService.getAllItemsForDashboard()...");
            
            List<ItemEntity> items = itemService.getAllItemsForDashboard();
            
            System.out.println("Service returned: " + (items != null ? items.size() : "null") + " items");
            
            if (items != null && !items.isEmpty()) {
                System.out.println("First 3 items:");
                for (int i = 0; i < Math.min(3, items.size()); i++) {
                    ItemEntity item = items.get(i);
                    System.out.println("  Item " + (i+1) + ":");
                    System.out.println("    ID: " + item.getItemId());
                    System.out.println("    Title: " + item.getItemTitle());
                    System.out.println("    Status: " + item.getStatus());
                    System.out.println("    Location: " + item.getLocation());
                    System.out.println("    User: " + (item.getUser() != null ? item.getUser().getUserId() : "null"));
                    System.out.println("    Category: " + (item.getCategory() != null ? item.getCategory().getCategoryName() : "null"));
                }
            } else {
                System.out.println("Items list is empty or null!");
            }
            
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            System.out.println("ERROR in getAllItems: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // SIMPLE: Get items with basic info only (no circular references)
    @GetMapping("/simple")
    public ResponseEntity<List<Map<String, Object>>> getSimpleItems() {
        try {
            System.out.println("=== GET SIMPLE ITEMS ===");
            
            List<ItemEntity> items = itemService.getAllItemsForDashboard();
            System.out.println("Found " + items.size() + " items in database");
            
            List<Map<String, Object>> simpleItems = new ArrayList<>();
            
            for (ItemEntity item : items) {
                Map<String, Object> map = new HashMap<>();
                map.put("itemId", item.getItemId());
                map.put("itemTitle", item.getItemTitle());
                map.put("itemDesc", item.getItemDesc());
                map.put("status", item.getStatus() != null ? item.getStatus().toString() : null);
                map.put("location", item.getLocation());
                map.put("dateReport", item.getDateReport());
                map.put("imageUrl", item.getImageUrl());
                map.put("userId", item.getUser() != null ? item.getUser().getUserId() : null);
                map.put("categoryName", item.getCategory() != null ? item.getCategory().getCategoryName() : null);
                map.put("departmentName", item.getDepartment() != null ? item.getDepartment().getDepName() : null);
                simpleItems.add(map);
            }
            
            System.out.println("Returning " + simpleItems.size() + " simple items");
            return ResponseEntity.ok(simpleItems);
            
        } catch (Exception e) {
            System.out.println("Error in simple endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // TEST: Get raw item data without relationships
    @GetMapping("/test-raw")
    public ResponseEntity<?> getRawItems() {
        try {
            System.out.println("=== TEST RAW ENDPOINT ===");
            
            // Direct database query
            List<Object[]> results = entityManager.createNativeQuery(
                "SELECT item_id, item_title, status, location, user_id FROM items LIMIT 10"
            ).getResultList();
            
            System.out.println("Raw SQL query returned " + results.size() + " rows");
            
            List<Map<String, Object>> items = new ArrayList<>();
            for (Object[] row : results) {
                Map<String, Object> item = new HashMap<>();
                item.put("itemId", row[0]);
                item.put("itemTitle", row[1]);
                item.put("status", row[2]);
                item.put("location", row[3]);
                item.put("userId", row[4]);
                items.add(item);
                System.out.println("Row: " + Arrays.toString(row));
            }
            
            return ResponseEntity.ok(items);
            
        } catch (Exception e) {
            System.out.println("Error in raw test: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    // READ: Get items by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ItemEntity>> getItemsByStatus(@PathVariable ItemStatus status) {
        try {
            List<ItemEntity> items = itemService.getItemsByStatus(status);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/lost")
    public ResponseEntity<List<ItemEntity>> getLostItems() {
        return getItemsByStatus(ItemStatus.LOST);
    }

    @GetMapping("/found")
    public ResponseEntity<List<ItemEntity>> getFoundItems() {
        return getItemsByStatus(ItemStatus.FOUND);
    }

    // READ: Get item by ID
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

    // READ: Get items by user
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

    // UPDATE: Update item status
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
    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @RequestBody ItemDTO itemDTO) {
        try {
            // Get existing item
            ItemEntity existingItem = itemService.getItemById(id);
            
            // Validate required fields from DTO
            if (itemDTO.getItemTitle() == null || itemDTO.getItemTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Item title is required");
            }
            if (itemDTO.getStatus() == null) {
                return ResponseEntity.badRequest().body("Item status is required");
            }
            if (itemDTO.getUserId() == null) {
                return ResponseEntity.badRequest().body("User ID is required");
            }
            if (itemDTO.getCategoryId() == null) {
                return ResponseEntity.badRequest().body("Category ID is required");
            }
            if (itemDTO.getDepartmentId() == null) {
                return ResponseEntity.badRequest().body("Department ID is required");
            }

            // Get related entities
            UserEntity user = userService.getUserById(itemDTO.getUserId());
            CategoryEntity category = categoryService.getCategoryById(itemDTO.getCategoryId());
            DepartmentEntity department = departmentService.getDepartmentById(itemDTO.getDepartmentId());

            // Update fields from DTO
            existingItem.setItemTitle(itemDTO.getItemTitle());
            existingItem.setItemDesc(itemDTO.getItemDesc());
            existingItem.setLocation(itemDTO.getLocation());
            existingItem.setImageUrl(itemDTO.getImageUrl());
            
            // Handle status conversion from String to ItemStatus enum
            try {
                existingItem.setStatus(ItemStatus.valueOf(itemDTO.getStatus()));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid status value: " + itemDTO.getStatus());
            }
            
            // Handle date conversion from String to LocalDateTime
            if (itemDTO.getDateReport() != null && !itemDTO.getDateReport().isEmpty()) {
                try {
                    LocalDate localDate = LocalDate.parse(itemDTO.getDateReport());
                    LocalDateTime dateTime = localDate.atStartOfDay();
                    existingItem.setDateReport(dateTime);
                } catch (DateTimeParseException e) {
                    return ResponseEntity.badRequest().body("Invalid date format. Use yyyy-MM-dd");
                }
            }
            
            existingItem.setUser(user);
            existingItem.setCategory(category);
            existingItem.setDepartment(department);

            // Save updated item
            ItemEntity updatedItem = itemService.updateItem(id, existingItem);
            
            // Return as DTO to avoid serialization issues
            return ResponseEntity.ok(new ItemDTO(updatedItem));

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Item not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating item: " + e.getMessage());
        }
    }

    // DELETE: Delete item
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
}