package com.hitpot.service.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@ApiModel("分享")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShareVO {
    @ApiModelProperty("视频id")
    private Long contentId;
    @ApiModelProperty("分享标识")
    private String utmContent;
    @ApiModelProperty("分享类型: 0站内分享, 1分享到facebook, 2分享到twitter, 3发布视频")
    private Integer shareType;
    @ApiModelProperty("分享评论")
    private String comment;

}
