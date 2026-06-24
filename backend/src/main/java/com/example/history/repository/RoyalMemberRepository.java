package com.example.history.repository;

import com.example.history.entity.RoyalMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoyalMemberRepository extends JpaRepository<RoyalMember, Long> {
    List<RoyalMember> findByDynastyIdOrderByIdAsc(Long dynastyId);
}
