package com.wildcatsfinder.wildcats_finder.repository;

import com.wildcatsfinder.wildcats_finder.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

}