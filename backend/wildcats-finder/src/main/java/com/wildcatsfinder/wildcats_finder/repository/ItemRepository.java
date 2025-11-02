package com.wildcatsfinder.wildcats_finder.repository;

import com.wildcatsfinder.wildcats_finder.entity.ItemEntity;
import com.wildcatsfinder.wildcats_finder.entity.ItemEntity.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<ItemEntity, Long> {

        // Dashboard - show all items by status
        List<ItemEntity> findByStatus(ItemStatus status);

        // Search functionality
        List<ItemEntity> findByItemTitleContainingIgnoreCase(String title);

        List<ItemEntity> findByLocationContainingIgnoreCase(String location);

        // User's own items
        List<ItemEntity> findByUser_UserId(Long userId);

        // Filtering by category/department
        List<ItemEntity> findByCategory_CategoryId(Long categoryId);

        List<ItemEntity> findByDepartment_DepId(Long departmentId);
}