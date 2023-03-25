package com.hitpot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum StockType {
    AUTHOR(0),
    STOCKHOLDER(1)
    ;
    private final int id;
}
