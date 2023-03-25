package com.hitpot.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum HitpotExceptionEnum {
    LOGIN_WALLET_ADDRESS_IS_NULL(10001, "登录钱包地址为空"),
    LOGIN_NONCE_IS_NULL(10002, "登录随机码不存在或已过期"),
    LOGIN_SIGNATURE_ERROR(10003, "签名错误"),
    PARAMETER_ERROR(20001, "请求参数错误"),
    CONTENT_NOT_EXIST(20002, "视频不存在"),
    BALANCE_POT_NO_SUFFICIENT(20003, "POT余额不足"),
    BALANCE_HIT_NO_SUFFICIENT(20004, "HIT余额不足"),
    BALANCE_NFT_NO_SUFFICIENT(20005, "NFT余额不足"),
    NFT_EXCEED_LIMIT_PER_INVESTOR(20006, "原始股东持有的NFT数量超过限制")
    ;
    private Integer id;
    private String msg;
}
