package com.hitpot.domain;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

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
    private Integer status;
    private Long amountPot;
    private Long amountHit;
    private Date paidTime;
}
