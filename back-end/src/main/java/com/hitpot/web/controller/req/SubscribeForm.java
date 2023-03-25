package com.hitpot.web.controller.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("订阅表单")
public class SubscribeForm {
    @ApiModelProperty("创作者id")
    private String creatorId;
}
