package com.hitpot.service.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@ApiModel("HIT的单价 x POT/HIT")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HitPriceVO {
    @ApiModelProperty("单价")
    private double price;
    @ApiModelProperty("当前时间可兑换HIT")
    private double amountHitLeft;
    @ApiModelProperty("计价周期的开始时间")
    private Date startTime;
    @ApiModelProperty("计价周期的结束时间")
    private Date endTime;
}
