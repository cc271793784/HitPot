package com.hitpot.common;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public class PageUtils {
    public static <T> PageChunk<T> buildPageChunk(List<T> items, Long total, Pageable pageable) {
        int pageSize = pageable.getPageSize();
        int pageNo = pageable.getPageNumber();
        return PageChunk.<T>builder()
            .items(items)
            .total(total)
            .pageSize(pageSize)
            .pageNo(pageNo + 1)
            .totalPages(Double.valueOf(Math.ceil(Double.valueOf(total) / Double.valueOf(pageSize))).intValue())
            .build();
    }

    public static <T> PageChunk<T> buildContentVOPageChunk(Page<T> paginationVO) {
        return PageChunk.<T>builder()
            .items(paginationVO.getContent())
            .total(paginationVO.getTotalElements())
            .totalPages(paginationVO.getTotalPages())
            .pageNo(paginationVO.getNumber() + 1)
            .pageSize(paginationVO.getSize())
            .build();
    }
}
