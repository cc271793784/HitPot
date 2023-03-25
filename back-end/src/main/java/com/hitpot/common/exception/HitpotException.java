package com.hitpot.common.exception;

import lombok.Getter;

@Getter
public class HitpotException extends RuntimeException {
    private int code;

    public HitpotException(HitpotExceptionEnum hitpotExceptionEnum) {
        super(hitpotExceptionEnum.getMsg());
        this.code = hitpotExceptionEnum.getId();
    }

    public HitpotException(int code, String msg) {
        super(msg);
        this.code = code;
    }
}
