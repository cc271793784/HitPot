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
@ApiModel("水龙头表单")
public class FaucetForm {
    @ApiModelProperty("钱包地址")
    private String address;
    @ApiModelProperty("领取数量")
    private double amount;
}
