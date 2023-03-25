package com.hitpot.repo;

import com.hitpot.domain.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long>, QuerydslPredicateExecutor<Content> {
}
