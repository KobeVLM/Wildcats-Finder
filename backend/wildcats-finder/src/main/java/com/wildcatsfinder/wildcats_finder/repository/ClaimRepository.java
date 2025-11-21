package com.wildcatsfinder.wildcats_finder.repository;

import com.wildcatsfinder.wildcats_finder.entity.ClaimEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<ClaimEntity, Long> {

    // User's claims page
    List<ClaimEntity> findByUser_UserId(Long userId);

    // Item details - show all claims for an item
    List<ClaimEntity> findByItem_ItemId(Long itemId);

    // Admin - pending claims
    List<ClaimEntity> findByVerified(Boolean verified);
}