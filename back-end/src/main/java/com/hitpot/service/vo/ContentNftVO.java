package com.hitpot.service.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@ApiModel("视频NFT余额")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContentNftVO {
    @ApiModelProperty("视频封面")
    private String coverImgUrl;
    @ApiModelProperty("视频id")
    private Long contentId;
    @ApiModelProperty("视频标题")
    private String title;
    @ApiModelProperty("NFT数量")
    private Long amount;
}
