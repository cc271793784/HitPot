package com.hitpot.domain;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "content_stock")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentStock extends BaseEntity {
    private String userId;
    private Long contentId;
    private Integer stockType;
    private Long countIpNft;
    private Long priceIpNft;
    private Long amountPot;
}
