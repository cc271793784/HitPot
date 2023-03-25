package com.hitpot.web.controller.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@ApiModel("向视频充值HIT表单")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContentCollectForm {
    @ApiModelProperty("充值的HIT金额")
    private Long amountHit;
    @ApiModelProperty("视频id")
    private Long contentId;
    @ApiModelProperty("广告链接")
    private String adLink;
    @ApiModelProperty("广告标题")
    private String adTitle;
}
