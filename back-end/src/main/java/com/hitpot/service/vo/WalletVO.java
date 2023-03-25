package com.hitpot.service.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@ApiModel("钱包")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletVO {
    @ApiModelProperty("用户id")
    private String userId;
    @ApiModelProperty("POT余额")
    private Long balancePot;
    @ApiModelProperty("HIT余额")
    private Long balanceHit;
    @ApiModelProperty("NFT类型及数量")
    private List<ContentNftVO> nfts;
}
