package com.hitpot.repo;

import com.hitpot.domain.ContentWatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentWatchRepository extends JpaRepository<ContentWatch, Long>, QuerydslPredicateExecutor<ContentWatch> {
}
