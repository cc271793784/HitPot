package com.hitpot.web.controller.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("提现表单")
public class WithdrawForm {
    @ApiModelProperty("提现pot数量")
    private double amountPot;
}
