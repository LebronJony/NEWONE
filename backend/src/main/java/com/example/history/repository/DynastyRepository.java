package com.example.history.repository;

import com.example.history.entity.Dynasty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DynastyRepository extends JpaRepository<Dynasty, Long> {
    List<Dynasty> findAllByOrderBySortOrderAsc();
}
