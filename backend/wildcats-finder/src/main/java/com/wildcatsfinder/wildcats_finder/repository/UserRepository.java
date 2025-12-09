package com.wildcatsfinder.wildcats_finder.repository;

import com.wildcatsfinder.wildcats_finder.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    // Login/registration
    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByEmail(String email);

    // Validation during registration
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM UserEntity u LEFT JOIN FETCH u.reportedItems WHERE u.username = :username")
    Optional<UserEntity> findByUsernameWithItems(@Param("username") String username);
}