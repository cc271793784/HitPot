package com.hitpot.service.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@ApiModel("视频")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContentVO {
    @ApiModelProperty("视频id")
    private Long contentId;
    @ApiModelProperty("创作者")
    private UserVO creator;
    @ApiModelProperty("视频文件名")
    private String videoFilename;
    @ApiModelProperty("视频访问地址")
    private String videoUrl;
    @ApiModelProperty("视频封面文件名")
    private String coverImg;
    @ApiModelProperty("视频封面访问地址")
    private String coverImgUrl;
    @ApiModelProperty("视频标题")
    private String title;
    @ApiModelProperty("视频描述")
    private String description;
    @ApiModelProperty("视频时长(ms)")
    private Long duration;
    @ApiModelProperty("观看视频的等级")
    private Integer watcherLevel;
    @ApiModelProperty("视频发行NFT的总数")
    private Long countIpNft;
    @ApiModelProperty("分配给原始股东NFT的最大数量")
    private Long countIpNftForInvestor;
    @ApiModelProperty("每个股东购买的最大NFT数量")
    private Long countMaxLimitPerInvestor;
    @ApiModelProperty("NFT单价")
    private double priceIpNft;
    @ApiModelProperty("为出售的NFT剩余数量")
    private Long countIpNftLeft;
    @ApiModelProperty("视频中剩余HIT数量")
    private double balanceHit;
    @ApiModelProperty("大V分享收益率")
    private Double yieldRateOfInfluencer;
    @ApiModelProperty("观看者收益率")
    private Double yieldRateOfViewer;
    @ApiModelProperty("是否点赞")
    private Boolean liked;
    @ApiModelProperty("是否收藏")
    private Boolean marked;
    @ApiModelProperty("广告列表")
    private List<AdVO> ads;
    @ApiModelProperty("发布时间")
    private Date createTime;
}
