package com.hitpot.repo;

import com.hitpot.domain.ContentHitConsume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentHitConsumeRepository extends JpaRepository<ContentHitConsume, Long>, QuerydslPredicateExecutor<ContentHitConsume> {
}
