package com.hitpot.service.vo;

import com.hitpot.domain.UserTransaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserTransactionWrap {
    private long price;
    private Date createTime;
    private UserTransaction userTransaction;
}
