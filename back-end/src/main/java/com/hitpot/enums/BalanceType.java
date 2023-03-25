package com.hitpot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum BalanceType {
    FUND_FOR_AD(0),
    FUND_FOR_PRESENT(1)
    ;
    private final int id;
}
