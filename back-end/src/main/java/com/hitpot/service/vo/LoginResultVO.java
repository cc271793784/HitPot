package com.hitpot.service.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@ApiModel(value = "登录结果")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResultVO {
    @ApiModelProperty(value = "accessToken")
    private String accessToken;
}
