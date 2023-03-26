package com.hitpot.web.advice;

import cn.dev33.satoken.exception.NotLoginException;
import cn.dev33.satoken.exception.NotPermissionException;
import com.hitpot.common.exception.HitpotException;
import com.hitpot.web.result.RestResult;
import com.hitpot.web.result.ResultEnum;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@Order(value = Ordered.LOWEST_PRECEDENCE - 2)
@RestControllerAdvice
public class ErrorHandler {

    @ExceptionHandler(NotPermissionException.class)
    public ResponseEntity<?> handlerNotPermissionException(NotPermissionException e) {
        log.error("not permission exception loginType={} code={} msg={}", e.getLoginType(), e.getCode(), e.getMessage());
        RestResult<?> restResult = RestResult.error(ResultEnum.UNAUTHORIZED);
        return new ResponseEntity<>(restResult, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(NotLoginException.class)
    public ResponseEntity<?> handlerNotLoginException(NotLoginException e) {
        log.error("not login exception loginType={} type={} msg={}", e.getLoginType(), e.getType(), e.getMessage());
        RestResult<?> restResult = RestResult.error(ResultEnum.FORBIDDEN);
        return new ResponseEntity<>(restResult, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(HitpotException.class)
    public ResponseEntity<?> handlerHitpotError(HitpotException e) {
        log.error("handler error: " + e.getMessage(), e);
        RestResult<?> restResult = RestResult.error(e.getCode(), e.getMessage());
        return new ResponseEntity<>(restResult, HttpStatus.BAD_REQUEST);
    }
}
