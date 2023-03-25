package com.hitpot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TokenType {
    POT(0),
    HIT(1);

    private final int id;
}
