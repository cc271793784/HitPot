package com.hitpot.service.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@ApiModel("素材")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MaterialVO {
    @ApiModelProperty("文件名（系统生成的）")
    private String filename;
    @ApiModelProperty("文件md5值")
    private String md5;
    @ApiModelProperty("原始文件名")
    private String originalFilename;
    @ApiModelProperty("文件类型: 0:表示视频, 1:表示图片")
    private Integer materialType;
    @ApiModelProperty("资源访问url")
    private String url;
    @ApiModelProperty("资源大小")
    private Long size;
}
