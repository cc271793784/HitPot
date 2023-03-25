package com.hitpot.service.vo;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@ApiModel("视频HIT信息")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContentHitLeftVO {
    private Long contentId;
    private Long amountHit;
}
