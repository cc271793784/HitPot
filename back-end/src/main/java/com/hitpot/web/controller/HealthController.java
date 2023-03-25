package com.hitpot.web.controller;

import com.hitpot.web.result.RestResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    @ResponseBody
    @RequestMapping("/inner/health")
    public RestResult<Boolean> healthCheck() {
        return RestResult.success(true);
    }
}
