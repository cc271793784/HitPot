package com.hitpot.domain;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "content_watch")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentWatch extends BaseEntity {
    private String userId;
    private Long contentId;
    private Long amountHit;
    private Long amountSec;
    private Long duration;
    private Integer userLevel;
    private String utmContent;
    private String referrerUserId;
    private Long referrerContentId;
}
