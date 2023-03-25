package com.hitpot.repo;

import com.hitpot.domain.ContentHitBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentHitBalanceRepository extends JpaRepository<ContentHitBalance, Long>, QuerydslPredicateExecutor<ContentHitBalance> {
}
