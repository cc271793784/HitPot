package com.hitpot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ConsumeType {
    CONSUME_FROM_CONTENT(0),
    CONSUME_FROM_SELF(1)
    ;
    private final int id;
}
