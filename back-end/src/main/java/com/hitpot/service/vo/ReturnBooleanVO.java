package com.hitpot.service.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@ApiModel("通用返回值")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReturnBooleanVO {
    @ApiModelProperty("是否成功")
    private Boolean success;
}
