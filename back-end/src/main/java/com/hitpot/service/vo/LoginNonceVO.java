package com.hitpot.service.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@ApiModel("随机数nonce")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginNonceVO {
    @ApiModelProperty("random nonce")
    private String nonce;

    @ApiModelProperty("生成时间")
    private Long timestamp;
}
