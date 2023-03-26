package com.hitpot.web.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.hitpot.service.WalletService;
import com.hitpot.service.vo.HitPriceVO;
import com.hitpot.service.vo.ReturnBooleanVO;
import com.hitpot.service.vo.WalletVO;
import com.hitpot.web.controller.req.*;
import com.hitpot.web.result.RestResult;
import com.hitpot.web.controller.req.*;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@Slf4j
@Api(tags = "钱包接口")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @ResponseBody
    @GetMapping
    @ApiOperation("我的钱包详细信息")
    public RestResult<WalletVO> detailWallet() {
        String userId = StpUtil.getLoginIdAsString();
        return RestResult.success(walletService.detailWallet(userId));
    }

    @ResponseBody
    @PostMapping("/withdraw")
    @ApiOperation("提现")
    public RestResult<ReturnBooleanVO> withdrawPot(@RequestBody WithdrawForm withdrawForm) {
        String userId = StpUtil.getLoginIdAsString();
        walletService.withdrawPot(userId, withdrawForm.getAmountPot());
        return RestResult.success(ReturnBooleanVO.builder().success(true).build());
    }

    @ResponseBody
    @PostMapping("/deposit-to-content")
    @ApiOperation("向视频中充值HIT")
    public RestResult<ReturnBooleanVO> contentCollectHit(@RequestBody ContentCollectForm contentCollectForm) {
        String userId = StpUtil.getLoginIdAsString();
        walletService.contentCollectHit(userId, contentCollectForm);
        return RestResult.success(ReturnBooleanVO.builder().success(true).build());
    }

    @ResponseBody
    @PostMapping("/purchase-content-nft")
    @ApiOperation("购买视频NFT份额")
    public RestResult<ReturnBooleanVO> purchaseContentNft(@RequestBody ContentPurchaseNftForm contentPurchaseNftForm) {
        String userId = StpUtil.getLoginIdAsString();
        walletService.purchaseContentNft(userId, contentPurchaseNftForm);
        return RestResult.success(ReturnBooleanVO.builder().success(true).build());
    }

    @ResponseBody
    @PostMapping("/exchange-hit")
    @ApiOperation("使用POT兑换HIT")
    public RestResult<ReturnBooleanVO> exchangeHit(@RequestBody ExchangeHitForm exchangeHitForm) {
        String userId = StpUtil.getLoginIdAsString();
        walletService.exchangeHit(userId, exchangeHitForm);
        return RestResult.success(ReturnBooleanVO.builder().success(true).build());
    }

    @ResponseBody
    @GetMapping("/price-of-hit")
    @ApiOperation("获取HIT单价")
    public RestResult<HitPriceVO> getHitPrice() {
        return RestResult.success(walletService.getPriceOfHit());
    }

    @ResponseBody
    @PostMapping("/faucet")
    @ApiOperation("获取POT水龙头")
    public RestResult<ReturnBooleanVO> potFaucet(@RequestBody FaucetForm faucetForm) {
        return RestResult.success(ReturnBooleanVO.builder().success(walletService.potFaucet(faucetForm)).build());
    }
}
