package com.hitpot.service.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@ApiModel("广告")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdVO {
    @ApiModelProperty("此广告剩余hit数量")
    private Long balanceHit;
    @ApiModelProperty("广告链接")
    private String adLink;
    @ApiModelProperty("广告标题")
    private String adTitle;
}
