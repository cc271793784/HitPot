package com.hitpot.web.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.hitpot.service.UserService;
import com.hitpot.service.vo.LoginResultVO;
import com.hitpot.service.vo.ReturnBooleanVO;
import com.hitpot.service.vo.UserVO;
import com.hitpot.web.controller.req.LevelForm;
import com.hitpot.web.controller.req.LoginForm;
import com.hitpot.web.controller.req.SubscribeForm;
import com.hitpot.web.controller.req.UserForm;
import com.hitpot.web.result.RestResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Slf4j
@Api(tags = "用户数据接口")
public class UserController {

    @Autowired
    private UserService userService;

    // @ResponseBody
    // @GetMapping("/user/gen-nonce")
    // @ApiOperation("使用钱包地址获取随机值nonce")
    // public RestResult<LoginNonceVO> genRandomNonce(@ApiParam("钱包地址") String walletAddress) {
    //     return RestResult.success(userService.genRandomNonce(walletAddress));
    // }

    @ResponseBody
    @PostMapping("/user/login")
    @ApiOperation("用户登录或注册")
    public RestResult<LoginResultVO> login(@RequestBody LoginForm loginForm) throws Exception {
        return RestResult.success(userService.login(loginForm));
    }

    @ResponseBody
    @GetMapping("/user/detail")
    @ApiOperation("获取用户详细信息")
    public RestResult<UserVO> detail() throws Exception {
        String userId = StpUtil.getLoginIdAsString();
        return RestResult.success(userService.detailUser(userId));
    }

    @ResponseBody
    @PostMapping("/user/upgrade-level")
    @ApiOperation("升级等级")
    public RestResult<UserVO> upgradeLevel(@RequestBody LevelForm levelForm) throws Exception {
        String userId = StpUtil.getLoginIdAsString();
        return RestResult.success(userService.upgradeLevel(userId, levelForm.getLevel()));
    }

    @ResponseBody
    @PostMapping("/user/subscribe")
    @ApiOperation("订阅创作者")
    public RestResult<ReturnBooleanVO> subscribeCreator(@RequestBody SubscribeForm subscribeForm) throws Exception {
        String userId = StpUtil.getLoginIdAsString();
        return RestResult.success(ReturnBooleanVO.builder().success(userService.subscribeCreator(userId, subscribeForm.getCreatorId())).build());
    }

    @ResponseBody
    @PostMapping("/user/unsubscribe")
    @ApiOperation("取消订阅创作者")
    public RestResult<ReturnBooleanVO> unSubscribeCreator(@RequestBody SubscribeForm subscribeForm) throws Exception {
        String userId = StpUtil.getLoginIdAsString();
        return RestResult.success(ReturnBooleanVO.builder().success(userService.unSubscribeCreator(userId, subscribeForm.getCreatorId())).build());
    }

    @ResponseBody
    @PostMapping("/user/update")
    @ApiOperation("更新用户信息")
    public RestResult<UserVO> updateProfile(@RequestBody UserForm userForm) {
        String userId = StpUtil.getLoginIdAsString();
        return RestResult.success((userService.updateProfile(userId, userForm)));
    }
}
