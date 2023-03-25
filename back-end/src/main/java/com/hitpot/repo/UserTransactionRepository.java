package com.hitpot.repo;

import com.hitpot.domain.UserTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTransactionRepository extends JpaRepository<UserTransaction, Long>, QuerydslPredicateExecutor<UserTransaction> {
}
