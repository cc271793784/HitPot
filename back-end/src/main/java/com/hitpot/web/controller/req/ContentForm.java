package com.hitpot.web.controller.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("发布视频内容表单")
public class ContentForm {
    @ApiModelProperty("视频文件名")
    private String videoFilename;
    @ApiModelProperty("视频封面")
    private String coverImg;
    @ApiModelProperty("视频内容标题")
    private String title;
    @ApiModelProperty("描述")
    private String description;
    @ApiModelProperty("观看等级")
    private Integer watchLevel;
    @ApiModelProperty("大V分享收益率")
    private Double yieldRateOfInfluencer;
    @ApiModelProperty("观看者收益率")
    private Double yieldRateOfViewer;
    @ApiModelProperty("是否激活IP NFT")
    private Boolean enabledIpNft;
    @ApiModelProperty("视频NFT的总数")
    private Long countIpNft;
    @ApiModelProperty("NFT可分配给原始股东的最大比例")
    private Double IpNftRatioForInvestor;
    @ApiModelProperty("每个原始股东持有的IP NFT的最大数量")
    private Long maxCountIpNftForPerInvestor;
    @ApiModelProperty("NFT单价")
    private double priceIpNft;
    @ApiModelProperty("注入HIT的数量")
    private double amountHit;
}
