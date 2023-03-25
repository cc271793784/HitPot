package com.hitpot.repo;

import com.hitpot.domain.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long>, QuerydslPredicateExecutor<Wallet> {
    Wallet findFirstByUserId(String userId);
}
