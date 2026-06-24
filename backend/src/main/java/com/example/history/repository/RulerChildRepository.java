package com.example.history.repository;

import com.example.history.entity.RulerChild;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RulerChildRepository extends JpaRepository<RulerChild, Long> {
    List<RulerChild> findByRulerIdOrderBySortOrderAsc(Long rulerId);
}
