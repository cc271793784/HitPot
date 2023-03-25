package com.hitpot.repo;

import com.hitpot.domain.UserTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTimelineRepository extends JpaRepository<UserTimeline, Long>, QuerydslPredicateExecutor<UserTimeline> {
}
