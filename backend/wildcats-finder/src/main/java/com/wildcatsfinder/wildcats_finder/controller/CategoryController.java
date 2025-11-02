package com.wildcatsfinder.wildcats_finder.controller;

import com.wildcatsfinder.wildcats_finder.entity.CategoryEntity;
import com.wildcatsfinder.wildcats_finder.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*") // For React frontend
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // READ: Get all categories for dropdown selection
    // GET /api/categories
    @GetMapping
    public ResponseEntity<List<CategoryEntity>> getAllCategories() {
        try {
            List<CategoryEntity> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // READ: Get category by ID
    // GET /api/categories/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        try {
            CategoryEntity category = categoryService.getCategoryById(id);
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Category not found: " + e.getMessage());
        }
    }

    // CREATE: Add new category (admin functionality)
    // POST /api/categories
    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody CategoryEntity category) {
        try {
            // Check if category name already exists
            if (categoryService.isCategoryNameExists(category.getCategoryName())) {
                return ResponseEntity.badRequest()
                        .body("Category name already exists: " + category.getCategoryName());
            }

            CategoryEntity savedCategory = categoryService.createCategory(category);
            return ResponseEntity.ok(savedCategory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating category: " + e.getMessage());
        }
    }

    // UPDATE: Update category (admin functionality)
    // PUT /api/categories/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody CategoryEntity categoryDetails) {
        try {
            CategoryEntity updatedCategory = categoryService.updateCategory(id, categoryDetails);
            return ResponseEntity.ok(updatedCategory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error updating category: " + e.getMessage());
        }
    }

    // DELETE: Delete category (admin functionality)
    // DELETE /api/categories/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            String result = categoryService.deleteCategory(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error deleting category: " + e.getMessage());
        }
    }

    // SEARCH: Search categories by name
    // GET /api/categories/search?name={name}
    @GetMapping("/search")
    public ResponseEntity<List<CategoryEntity>> searchCategories(@RequestParam String name) {
        try {
            List<CategoryEntity> categories = categoryService.searchCategoriesByName(name);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}