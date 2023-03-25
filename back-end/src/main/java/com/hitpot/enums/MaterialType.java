package com.hitpot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum MaterialType {
    VIDEO(0),
    IMAGE(1)
    ;
    private final int id;
}
