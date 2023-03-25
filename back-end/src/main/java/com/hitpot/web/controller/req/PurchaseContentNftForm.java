package com.hitpot.web.controller.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("购买视频NFT表单")
public class PurchaseContentNftForm {
    @ApiModelProperty("视频ID")
    private Long contentId;
    @ApiModelProperty("购买NFT的数量")
    private Long count;
    @ApiModelProperty("购买NFT话费的POT金额")
    private Long amountPot;
}
