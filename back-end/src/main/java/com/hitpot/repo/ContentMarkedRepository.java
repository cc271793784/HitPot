package com.hitpot.repo;

import com.hitpot.domain.ContentMarked;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentMarkedRepository extends JpaRepository<ContentMarked, Long>, QuerydslPredicateExecutor<ContentMarked> {
    ContentMarked findFirstByContentIdAndUtmContent(Long contentId, String utmContent);

    ContentMarked findFirstByContentIdAndUserId(Long contentId, String userId);
}
