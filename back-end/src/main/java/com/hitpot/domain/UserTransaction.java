package com.hitpot.domain;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "user_transaction")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserTransaction extends BaseEntity {
    private String userId;
    private Integer transactionType;
    private Long refundTransactionId;
    private Integer status;
    private Long amountPot;
    private Long amountHit;
}
