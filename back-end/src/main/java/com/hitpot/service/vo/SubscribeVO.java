package com.hitpot.service.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@ApiModel("是否订阅信息")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubscribeVO {
    @ApiModelProperty("创作者id")
    private String creatorId;
    @ApiModelProperty("是否订阅")
    private boolean subscribe;
}
