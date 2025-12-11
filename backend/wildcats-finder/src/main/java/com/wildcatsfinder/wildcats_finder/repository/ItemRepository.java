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

        // Find items by status in a list (e.g., [LOST, FOUND] for active items)
        List<ItemEntity> findByStatusIn(List<ItemStatus> statuses);

        // Search by title AND status (for public search - exclude PENDING)
        List<ItemEntity> findByItemTitleContainingIgnoreCaseAndStatusIn(String title, List<ItemStatus> statuses);

        // Search by description
        List<ItemEntity> findByItemDescContainingIgnoreCaseAndStatusIn(String desc, List<ItemStatus> statuses);

        // Count by status
        long countByStatus(ItemStatus status);
}