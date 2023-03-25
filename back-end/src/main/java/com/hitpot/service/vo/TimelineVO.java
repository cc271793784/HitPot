package com.hitpot.service.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("时间线")
public class TimelineVO {
    @ApiModelProperty("id")
    private Long contentTimelineId;
    @ApiModelProperty("视频详细信息")
    private ContentVO content;
    @ApiModelProperty("分享评论")
    private String comment;
    @ApiModelProperty("评论时间")
    private Date createTime;
}
