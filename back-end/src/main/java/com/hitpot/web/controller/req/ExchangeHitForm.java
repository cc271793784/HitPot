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
@ApiModel("兑换HIT表单")
public class ExchangeHitForm {
    @ApiModelProperty("要兑换的HIT数量")
    private Long countHit;
    @ApiModelProperty("HIT的价格")
    private Double priceHit;
}
