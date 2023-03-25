package com.hitpot.repo;

import com.hitpot.domain.ContentStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentStockRepository extends JpaRepository<ContentStock, Long>, QuerydslPredicateExecutor<ContentStock> {
    List<ContentStock> findAllByUserId(String userId);

    ContentStock findFirstByUserIdAndContentId(String userId, Long contentId);
}
