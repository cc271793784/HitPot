package com.hitpot.domain;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "content")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Content extends BaseEntity {
    private String userId;
    private String videoFilename;
    private String coverImg;
    private String title;
    private String description;
    private Long duration;
    private Integer watcherLevel;
    private Long countIpNft;
    private Long countIpNftForInvestor;
    private Long countMaxLimitPerInvestor;
    private Long priceIpNft;
    private Long countIpNftLeft;
    private Double yieldRateInfluencer;
    private Double yieldRateViewer;
    private Boolean disabled;
    private Boolean deleted;
}
