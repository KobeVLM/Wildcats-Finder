package com.wildcatsfinder.wildcats_finder.service;

import com.wildcatsfinder.wildcats_finder.entity.ItemEntity;
import com.wildcatsfinder.wildcats_finder.entity.ItemEntity.ItemStatus;
import com.wildcatsfinder.wildcats_finder.entity.UserEntity;
import com.wildcatsfinder.wildcats_finder.entity.CategoryEntity;
import com.wildcatsfinder.wildcats_finder.entity.DepartmentEntity;
import com.wildcatsfinder.wildcats_finder.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    // CREATE: Add a new item
    public ItemEntity createItem(ItemEntity item) {
        return itemRepository.save(item);
    }

    // READ: Fetch all items
    public List<ItemEntity> getAllItems() {
        return itemRepository.findAll();
    }

    // READ: Fetch an item by its ID
    public ItemEntity getItemById(Long id) {
        Optional<ItemEntity> item = itemRepository.findById(id);
        if (item.isPresent()) {
            return item.get();
        } else {
            throw new NoSuchElementException("Item " + id + " not found");
        }
    }

    // READ: Fetch items by status
    public List<ItemEntity> getItemsByStatus(ItemStatus status) {
        return itemRepository.findByStatus(status);
    }

    // READ: Fetch items by user (reporter)
    public List<ItemEntity> getItemsByUser(UserEntity user) {
        return itemRepository.findByUser_UserId(user.getUserId());
    }

    // READ: Fetch items by category
    public List<ItemEntity> getItemsByCategory(CategoryEntity category) {
        return itemRepository.findByCategory_CategoryId(category.getCategoryId());
    }

    // READ: Fetch items by department
    public List<ItemEntity> getItemsByDepartment(DepartmentEntity department) {
        return itemRepository.findByDepartment_DepId(department.getDepId());
    }

    // SEARCH: Find items by location containing search term
    public List<ItemEntity> searchItemsByLocation(String location) {
        return itemRepository.findByLocationContainingIgnoreCase(location);
    }

    // SEARCH: Find items by title containing search term
    public List<ItemEntity> searchItemsByTitle(String title) {
        return itemRepository.findByItemTitleContainingIgnoreCase(title);
    }

    // SEARCH: Find items by description containing search term
    public List<ItemEntity> searchItemsByDescription(String description) {
        List<ItemEntity> items = itemRepository.findAll();
        List<ItemEntity> matchingItems = new ArrayList<>();

        // Loop through each item and check if description contains search term
        for (ItemEntity item : items) {
            if (item.getItemDesc() != null &&
                    item.getItemDesc().toLowerCase().contains(description.toLowerCase())) {
                matchingItems.add(item);
            }
        }

        return matchingItems;
    }

    // READ: Fetch items reported between two dates
    public List<ItemEntity> getItemsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        List<ItemEntity> items = itemRepository.findAll();
        List<ItemEntity> matchingItems = new ArrayList<>();

        // Loop through each item and check if date is between start and end dates
        for (ItemEntity item : items) {
            if (item.getDateReport().isAfter(startDate) && item.getDateReport().isBefore(endDate)) {
                matchingItems.add(item);
            }
        }

        return matchingItems;
    }

    // READ: Fetch items by user and status
    public List<ItemEntity> getItemsByUserAndStatus(UserEntity user, ItemStatus status) {
        // Combining available methods
        List<ItemEntity> userItems = itemRepository.findByUser_UserId(user.getUserId());
        List<ItemEntity> matchingItems = new ArrayList<>();

        // Loop through user's items and check if status matches
        for (ItemEntity item : userItems) {
            if (item.getStatus() == status) {
                matchingItems.add(item);
            }
        }

        return matchingItems;
    }

    // READ: Fetch recent items (last 30 days)
    public List<ItemEntity> getRecentItems() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<ItemEntity> items = itemRepository.findAll();
        List<ItemEntity> recentItems = new ArrayList<>();

        // Loop through each item and check if it was reported in the last 30 days
        for (ItemEntity item : items) {
            if (item.getDateReport().isAfter(thirtyDaysAgo)) {
                recentItems.add(item);
            }
        }

        return recentItems;
    }

    // UPDATE: Modify an existing item
    public ItemEntity updateItem(Long id, ItemEntity itemDetails) {
        // Check Optional explicitly and assign to a variable
        ItemEntity item;
        Optional<ItemEntity> optionalItem = itemRepository.findById(id);
        if (optionalItem.isPresent()) {
            item = optionalItem.get();
        } else {
            throw new NoSuchElementException("Item " + id + " not found");
        }

        // Update item fields
        item.setItemTitle(itemDetails.getItemTitle());
        item.setItemDesc(itemDetails.getItemDesc());
        item.setDateReport(itemDetails.getDateReport());
        item.setLocation(itemDetails.getLocation());
        item.setImageUrl(itemDetails.getImageUrl());
        item.setStatus(itemDetails.getStatus());
        item.setUser(itemDetails.getUser());
        item.setCategory(itemDetails.getCategory());
        item.setDepartment(itemDetails.getDepartment());

        return itemRepository.save(item);
    }

    // UPDATE: Change item status
    public ItemEntity updateItemStatus(Long id, ItemStatus newStatus) {
        // Check Optional explicitly and assign to a variable
        ItemEntity item;
        Optional<ItemEntity> optionalItem = itemRepository.findById(id);
        if (optionalItem.isPresent()) {
            item = optionalItem.get();
        } else {
            throw new NoSuchElementException("Item " + id + " not found");
        }

        // Update only the status
        item.setStatus(newStatus);
        return itemRepository.save(item);
    }

    // DELETE: Remove an item
    public String deleteItem(Long id) {
        if (itemRepository.findById(id).isPresent()) {
            itemRepository.deleteById(id);
            return "Item " + id + " is successfully deleted!";
        } else {
            return "Item " + id + " does not exist.";
        }
    }

    // DASHBOARD: Get all items for Item Cards
    public List<ItemEntity> getAllItemsForDashboard() {
        return itemRepository.findAll();
    }

    // REPORT: Report a lost item
    public ItemEntity reportLostItem(ItemEntity item) {
        item.setStatus(ItemStatus.LOST);
        item.setDateReport(LocalDateTime.now());
        return itemRepository.save(item);
    }

    // REPORT: Report a found item
    public ItemEntity reportFoundItem(ItemEntity item) {
        item.setStatus(ItemStatus.FOUND);
        item.setDateReport(LocalDateTime.now());
        return itemRepository.save(item);
    }

    // SEARCH: Combined search for frontend
    public List<ItemEntity> searchItems(String title, String location) {
        if (title != null && location != null) {
            // Search by both title and location
            List<ItemEntity> titleResults = itemRepository.findByItemTitleContainingIgnoreCase(title);
            List<ItemEntity> locationResults = itemRepository.findByLocationContainingIgnoreCase(location);
            // Combine results ( // ?: Intersection Logic// )
            titleResults.addAll(locationResults);
            return titleResults;
        } else if (title != null) {
            return itemRepository.findByItemTitleContainingIgnoreCase(title);
        } else if (location != null) {
            return itemRepository.findByLocationContainingIgnoreCase(location);
        } else {
            return itemRepository.findAll();
        }
    }

    // USER ITEMS: Get items reported by a specific user
    public List<ItemEntity> getItemsByUserId(Long userId) {
        return itemRepository.findByUser_UserId(userId);
    }

    // FILTER: Get items by category for filtering
    public List<ItemEntity> getItemsByCategoryId(Long categoryId) {
        return itemRepository.findByCategory_CategoryId(categoryId);
    }

    // FILTER: Get items by department for filtering
    public List<ItemEntity> getItemsByDepartmentId(Long departmentId) {
        return itemRepository.findByDepartment_DepId(departmentId);
    }
}