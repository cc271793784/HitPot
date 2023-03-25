package com.hitpot.web.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.hitpot.service.MaterialService;
import com.hitpot.service.vo.MaterialVO;
import com.hitpot.web.controller.req.UploadForm;
import com.hitpot.web.result.RestResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/material/upload")
@Slf4j
@Api(tags = "素材上传接口")
public class MaterialUploadController {

    @Autowired
    private MaterialService materialService;

    @ResponseBody
    @PostMapping()
    @ApiOperation("上传素材")
    public RestResult<MaterialVO> uploadMaterial(UploadForm uploadForm) throws Exception {
        String userId = StpUtil.getLoginIdAsString();
        return RestResult.success(materialService.uploadMaterial(userId, uploadForm));
    }
}
