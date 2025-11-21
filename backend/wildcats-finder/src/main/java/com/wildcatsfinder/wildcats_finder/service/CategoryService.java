package com.wildcatsfinder.wildcats_finder.service;

import com.wildcatsfinder.wildcats_finder.entity.CategoryEntity;
import com.wildcatsfinder.wildcats_finder.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // CREATE: Add a new category
    public CategoryEntity createCategory(CategoryEntity category) {
        return categoryRepository.save(category);
    }

    // READ: Fetch all categories
    public List<CategoryEntity> getAllCategories() {
        return categoryRepository.findAll();
    }

    // READ: Fetch a category by its ID
    public CategoryEntity getCategoryById(Long id) {
        Optional<CategoryEntity> category = categoryRepository.findById(id);
        if (category.isPresent()) {
            return category.get();
        } else {
            throw new NoSuchElementException("Category " + id + " not found");
        }
    }

    // READ: Fetch a category by its name
    public CategoryEntity getCategoryByName(String categoryName) {
        List<CategoryEntity> categories = categoryRepository.findAll();

        // Loop through each category and check if the name matches
        for (CategoryEntity category : categories) {
            if (category.getCategoryName().equals(categoryName)) {
                return category; // Found a match, return category immediately
            }
        }

        // No match was found
        throw new NoSuchElementException("Category with name '" + categoryName + "' not found");
    }

    // CHECK: Verify if category name already exists
    public boolean isCategoryNameExists(String categoryName) {
        List<CategoryEntity> categories = categoryRepository.findAll();

        // Loop through each category and check if the name matches
        for (CategoryEntity category : categories) {
            if (category.getCategoryName().equals(categoryName)) {
                return true; // Found a match, return true
            }
        }

        // No match was found
        return false;
    }

    // SEARCH: Find categories by name containing search term
    public List<CategoryEntity> searchCategoriesByName(String searchTerm) {
        List<CategoryEntity> categories = categoryRepository.findAll();
        List<CategoryEntity> matchingCategories = new ArrayList<>();

        // Loop through each category and check if name contains search term
        for (CategoryEntity category : categories) {
            if (category.getCategoryName().toLowerCase().contains(searchTerm.toLowerCase())) {
                matchingCategories.add(category);
            }
        }

        return matchingCategories;
    }

    // UPDATE: Modify an existing category
    public CategoryEntity updateCategory(Long id, CategoryEntity categoryDetails) {
        // Check Optional explicitly and assign to a variable
        CategoryEntity category;
        Optional<CategoryEntity> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isPresent()) {
            category = optionalCategory.get();
        } else {
            throw new NoSuchElementException("Category " + id + " not found");
        }

        // Update category fields
        category.setCategoryName(categoryDetails.getCategoryName());
        category.setCatDescription(categoryDetails.getCatDescription());

        return categoryRepository.save(category);
    }

    // DELETE: Remove a category
    public String deleteCategory(Long id) {
        if (categoryRepository.findById(id).isPresent()) {
            categoryRepository.deleteById(id);
            return "Category " + id + " is successfully deleted!";
        } else {
            return "Category " + id + " does not exist.";
        }
    }
}