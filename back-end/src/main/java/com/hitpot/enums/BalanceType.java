package com.hitpot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@Getter
public enum BalanceType {
    FUND_FOR_AD(0),
    FUND_FOR_PRESENT(1)
    ;
    private final int id;

    private static final Map<Integer, BalanceType> typeMap = new HashMap<>();

    static {
        typeMap.put(FUND_FOR_AD.id, FUND_FOR_AD);
        typeMap.put(FUND_FOR_PRESENT.id, FUND_FOR_PRESENT);
    }

    public static BalanceType getById(int id) {
        return typeMap.get(id);
    }
}
