package com.hitpot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TransactionType {
    USER_POT_EXCHANGE_HIT(0),
    USER_POT_DEPOSIT_TO_PLATFORM(1),
    USER_POT_WITHDRAW_FROM_PLATFORM(2),
    USER_POT_MINT(3),
    ;
    private final int id;
}
