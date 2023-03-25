package com.hitpot.service.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserLevelPermission {
    // 可观看时长, 秒
    private Long duration;
    // 每秒消耗HIT的数量
    private double amountHitPerSecond;
    // 每秒生成SEC的数量
    private double amountSecPerSecond;
}
