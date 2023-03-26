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
    USER_NOT_EXIST(20003, "用户不存在"),
    MATERIAL_NOT_EXIST(20004, "资源不存在"),
    CONTENT_WATCH_DURATION_INVALID(20005, "资源不存在"),
    CANNOT_SELL_TO_SELF(20006, "NFT不能卖给自己"),
    BALANCE_POT_NO_SUFFICIENT(20100, "POT余额不足"),
    BALANCE_HIT_NO_SUFFICIENT(20101, "HIT余额不足"),
    BALANCE_NFT_NO_SUFFICIENT(20102, "NFT余额不足"),
    NFT_EXCEED_LIMIT_PER_INVESTOR(20103, "原始股东持有的NFT数量超过限制"),
    WATCH_TIME_SUFFICIENT(20104, "观看时长不足"),
    WATCH_LEVEL_NOT_MEET(20105, "不满足观看等级"),
    PAYMENT_POT_NO_SUFFICIENT(20106, "用于支付POT不足"),
    ;
    private Integer id;
    private String msg;
}
