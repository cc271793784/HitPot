package com.hitpot.web.controller.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("等级表单")
public class LevelForm {
    @ApiModelProperty("用户等级")
    private Integer level;
}
