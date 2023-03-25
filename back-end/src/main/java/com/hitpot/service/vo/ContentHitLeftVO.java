package com.hitpot.service.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@ApiModel("视频HIT信息")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContentHitLeftVO {
    @ApiModelProperty("视频id")
    private Long contentId;
    @ApiModelProperty("视频剩余hit")
    private double amountHit;
    @ApiModelProperty("广告列表")
    private List<AdVO> ads;
}
