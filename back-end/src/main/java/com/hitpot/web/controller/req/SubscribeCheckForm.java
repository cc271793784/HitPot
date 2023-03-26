package com.hitpot.web.controller.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

@Data
@ApiModel("检查是否订阅了作者")
public class SubscribeCheckForm {
    @ApiModelProperty("创作者id列表")
    private List<String> creatorId;
}
