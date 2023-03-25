package com.hitpot.repo;

import com.hitpot.domain.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long>, QuerydslPredicateExecutor<Material> {
    Material findFirstByFilename(String filename);
}
