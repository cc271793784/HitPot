package com.hitpot.web.controller.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("分享表单")
public class ShareForm {
    @ApiModelProperty("视频id")
    private Long contentId;
    @ApiModelProperty("分享类型")
    private Integer shareType;
    @ApiModelProperty("分享评论")
    private String comment;
}
