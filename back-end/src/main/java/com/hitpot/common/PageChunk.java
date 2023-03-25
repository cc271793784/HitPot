package com.hitpot.common;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@ApiModel("分页")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageChunk<T> {
    @ApiModelProperty("items")
    @Builder.Default
    private List<T> items = new ArrayList<>();
    @ApiModelProperty("总数")
    private Long total;
    @ApiModelProperty("总页数")
    private Integer totalPages;
    @ApiModelProperty("当前页")
    private Integer pageNo;
    @ApiModelProperty("每页数量")
    private Integer pageSize;
}
