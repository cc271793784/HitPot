package com.hitpot.web.controller.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("购买NFT表单")
public class ContentPurchaseNftForm {
    @ApiModelProperty("视频id")
    private Long contentId;
    @ApiModelProperty("购买NFT的数量")
    private Long count;
    @ApiModelProperty("使用POT的数量")
    private double amountPot;
}
