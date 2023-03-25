package com.hitpot.domain;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "content_hit_consume")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentHitConsume extends BaseEntity {
    private String userId;
    private Long contentWatchId;
    private Integer consumeType;
    private Long amountHit;
    private Long contentHitBalanceId;
}
