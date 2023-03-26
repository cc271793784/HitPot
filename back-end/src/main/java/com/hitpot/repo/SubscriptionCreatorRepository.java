package com.hitpot.repo;

import com.hitpot.domain.SubscriptionCreator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionCreatorRepository extends JpaRepository<SubscriptionCreator, Long>, QuerydslPredicateExecutor<SubscriptionCreator> {
    SubscriptionCreator findFirstByUserIdAndCreatorId(String userId, String creatorId);

    List<SubscriptionCreator> findAllByUserId(String userId);

    List<SubscriptionCreator> findAllByUserIdAndCreatorIdIn(String userId, List<String> creatorId);
}
