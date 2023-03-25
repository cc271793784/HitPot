package com.hitpot.domain;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "content_hit_balance")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentHitBalance extends BaseEntity {
    private String userId;
    private Long contentId;
    private Long amountHit;
    private Long balanceHit;
    private Integer balanceType;
    private String adLink;
    private String adTitle;
}
