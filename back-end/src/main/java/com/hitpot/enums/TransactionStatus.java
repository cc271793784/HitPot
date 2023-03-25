package com.hitpot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TransactionStatus {
    SUCCESS(0),
    PROCESSING(1),
    FAILURE(2)
    ;
    private final int id;
}
