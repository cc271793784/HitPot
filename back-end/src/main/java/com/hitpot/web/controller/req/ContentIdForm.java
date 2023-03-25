package com.hitpot.web.controller.req;

import io.swagger.annotations.ApiModel;
import lombok.Data;

@Data
@ApiModel("视频id表单")
public class ContentIdForm {
    private Long contentId;
}
