package com.example.history.repository;

import com.example.history.entity.Ruler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RulerRepository extends JpaRepository<Ruler, Long> {
    List<Ruler> findByDynastyIdOrderByIdAsc(Long dynastyId);
}
