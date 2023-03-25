package com.hitpot.web.controller.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("视频观看打点信息")
public class WatchForm {
    @ApiModelProperty("视频id")
    private Long contentId;
    @ApiModelProperty("观看时长(秒)")
    private Long duration;
    @ApiModelProperty("分享唯一标识")
    private String utmContent;
}
