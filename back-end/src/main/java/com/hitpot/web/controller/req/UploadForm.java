package com.hitpot.web.controller.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@ApiModel("素材上传表单")
public class UploadForm {
    @ApiModelProperty("上传文件信息")
    private MultipartFile file;
    @ApiModelProperty("文件类型: 0:表示视频, 1:表示图片")
    private Integer materialType;
}
