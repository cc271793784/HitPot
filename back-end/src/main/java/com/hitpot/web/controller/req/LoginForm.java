package com.hitpot.web.controller.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel(value = "用户登录表单")
public class LoginForm {
    @ApiModelProperty(value = "钱包地址")
    private String walletAddress;
    @ApiModelProperty(value = "签名")
    private String signature;
    @ApiModelProperty(value = "被签名信息")
    private String message;
}
